import request from 'supertest';
import app from '../app.js'; // Importa la aplicación Express
import { db } from '../db.js'; // Importa la conexión a la base de datos

// Variables de prueba para usuarios
const testUser = {
  username: 'testuser_auth',
  email: 'test_auth@example.com',
  password: 'testpassword123',
};

const anotherUser = {
  username: 'anotheruser_auth',
  email: 'another_auth@example.com',
  password: 'anotherpassword123',
};

// Helper para obtener la cookie de la respuesta
const getCookie = (res, name) => {
    const header = res.headers['set-cookie'];
    if (!header) return null;
    const cookie = header.find(s => s.startsWith(`${name}=`));
    if (!cookie) return null;
    return cookie.split(';')[0];
};

describe('API de Autenticación (/api/auth)', () => {
  beforeAll(async () => {
    // Limpiar usuarios de pruebas anteriores
    await db.query("DELETE FROM users WHERE username = ? OR username = ?", [testUser.username, anotherUser.username]);
  });

  afterAll(async () => {
    // Limpiar usuarios creados durante las pruebas
    await db.query("DELETE FROM users WHERE username = ? OR username = ?", [testUser.username, anotherUser.username]);
    await db.end(); // Asegúrate de cerrar la conexión a la DB después de todos los tests
  });

  // --- POST /api/auth/register ---
  describe('POST /api/auth/register', () => {
    it('debería registrar un nuevo usuario con éxito (200 OK)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual("User has been created.");

      // Verificar que el usuario existe en la DB
      const [data] = await db.query("SELECT * FROM users WHERE username = ?", [testUser.username]);
      expect(data.length).toBe(1);
      expect(data[0].email).toEqual(testUser.email);
    });

    it('debería retornar 409 si el usuario o email ya existen', async () => {
      // Intentar registrar el mismo usuario de nuevo
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      expect(res.statusCode).toEqual(409);
      expect(res.body).toEqual("User already exists.");
    });

    it('debería retornar 500 si faltan campos requeridos (ej. password)', async () => {
      const incompleteUser = {
        username: 'incomplete_user',
        email: 'incomplete@example.com',
        // password missing
      };
      const res = await request(app)
        .post('/api/auth/register')
        .send(incompleteUser);
      expect(res.statusCode).toEqual(500); // MySQL strict mode podría dar error al no tener default
      // El mensaje de error puede variar dependiendo de la configuración de la DB y el manejo de errores.
      // Aquí esperamos un error del servidor, que tu controlador captura como 500.
    });
  });

  // --- POST /api/auth/login ---
  describe('POST /api/auth/login', () => {
    it('debería logear un usuario con credenciales correctas (200 OK) y establecer cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: testUser.password });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('username', testUser.username);
      expect(res.body).not.toHaveProperty('password'); // La contraseña no debe ser retornada
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toContain('access_token');
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nonexistentuser', password: 'anypassword' });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual("User not found.");
    });

    it('debería retornar 400 con credenciales incorrectas (contraseña incorrecta)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: 'wrongpassword' });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual("Wrong username or password.");
    });
  });

  // --- POST /api/auth/logout ---
  describe('POST /api/auth/logout', () => {
    let agent;
    let cookie;

    beforeEach(async () => {
      // Primero, registrar y logear un usuario para obtener una cookie
      await request(app).post('/api/auth/register').send(anotherUser);
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: anotherUser.username, password: anotherUser.password });

      cookie = getCookie(res, 'access_token');
      agent = request.agent(app);
      agent.jar.setCookie(cookie);
    });

    afterEach(async () => {
      // Limpiar el usuario 'anotherUser' después de sus pruebas
      await db.query("DELETE FROM users WHERE username = ?", [anotherUser.username]);
    });

    it('debería deslogear al usuario y limpiar la cookie (200 OK)', async () => {
      const res = await agent.post('/api/auth/logout');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual("User has been logged out.");
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toContain('access_token=;'); // Cookie debe ser limpiada
      expect(res.headers['set-cookie'][0]).toContain('Expires=Thu, 01 Jan 1970'); // Fecha de expiración en el pasado
    });

    it('debería deslogear correctamente incluso si no hay cookie (no error 401/403 esperado)', async () => {
      // Realizar un logout sin haber hecho login (o con una cookie ya expirada/inexistente)
      const res = await request(app).post('/api/auth/logout'); // Usar request directo sin agent
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual("User has been logged out.");
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toContain('access_token=;');
    });
  });
});