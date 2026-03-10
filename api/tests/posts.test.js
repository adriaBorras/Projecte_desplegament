import request from 'supertest';
import app from '../app.js'; // Importa la aplicación Express
import { db } from '../db.js'; // Importa la conexión a la base de datos
import bcrypt from 'bcryptjs';

// Variables para usuarios y posts de prueba
let testUser = {
  username: 'testuser_posts',
  email: 'test_posts@example.com',
  password: 'testpassword123',
};
let adminUser = {
  username: 'adminuser_posts',
  email: 'admin_posts@example.com',
  password: 'adminpassword123',
};
let authenticatedAgent; // Agente de Supertest para mantener la sesión del usuario de prueba
let adminAgent; // Agente de Supertest para mantener la sesión del usuario admin
let testPostId; // ID de un post creado por el usuario de prueba
let testAdminPostId; // ID de un post creado por el usuario admin

// Helper para obtener la cookie de la respuesta
const getCookie = (res, name) => {
    const header = res.headers['set-cookie'];
    if (!header) return null;
    const cookie = header.find(s => s.startsWith(`${name}=`));
    if (!cookie) return null;
    return cookie.split(';')[0];
};

describe('API de Posts', () => {
  beforeAll(async () => {
    // Limpiar usuarios y posts de pruebas anteriores
    await db.query("DELETE FROM users WHERE username = ? OR username = ?", [testUser.username, adminUser.username]);
    await db.query("DELETE FROM posts WHERE uid IN (SELECT id FROM users WHERE username = ? OR username = ?)", [testUser.username, adminUser.username]);

    // Registrar y logear usuarios de prueba
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testUser.password, salt);
    const hashedPasswordAdmin = await bcrypt.hash(adminUser.password, salt);

    await db.query(
      "INSERT INTO users(`username`, `email`, `password`) VALUES (?, ?, ?)",
      [testUser.username, testUser.email, hashedPassword]
    );

    await db.query(
        "INSERT INTO users(`username`, `email`, `password`) VALUES (?, ?, ?)",
        [adminUser.username, adminUser.email, hashedPasswordAdmin]
    );

    // Login del usuario de prueba
    let res = await request(app)
      .post('/api/auth/login')
      .send({ username: testUser.username, password: testUser.password });

    const cookie = getCookie(res, 'access_token');
    authenticatedAgent = request.agent(app);
    authenticatedAgent.jar.setCookie(cookie);

    // Login del usuario admin
    res = await request(app)
      .post('/api/auth/login')
      .send({ username: adminUser.username, password: adminUser.password });

    const adminCookie = getCookie(res, 'access_token');
    adminAgent = request.agent(app);
    adminAgent.jar.setCookie(adminCookie);

    // Crear un post inicial para el usuario de prueba
    const postData = {
        title: "Test Post Title",
        desc: "This is a description for a test post.",
        img: "test_image.jpg",
        cat: "test",
        date: new Date().toISOString().slice(0, 19).replace('T', ' '), // Formato MySQL DATETIME
    };
    const userRes = await db.query("SELECT id FROM users WHERE username = ?", [testUser.username]);
    const userId = userRes[0][0].id;

    const [insertResult] = await db.query(
        "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`, `uid`) VALUES (?, ?, ?, ?, ?, ?)",
        [postData.title, postData.desc, postData.img, postData.cat, postData.date, userId]
    );
    testPostId = insertResult.insertId;

    // Crear un post inicial para el usuario admin
    const adminUserRes = await db.query("SELECT id FROM users WHERE username = ?", [adminUser.username]);
    const adminUserId = adminUserRes[0][0].id;
    const [insertAdminResult] = await db.query(
        "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`, `uid`) VALUES (?, ?, ?, ?, ?, ?)",
        [postData.title + ' Admin', postData.desc, postData.img, postData.cat, postData.date, adminUserId]
    );
    testAdminPostId = insertAdminResult.insertId;
  });

  afterAll(async () => {
    // Limpiar posts y usuarios creados durante las pruebas
    await db.query("DELETE FROM posts WHERE uid IN (SELECT id FROM users WHERE username = ? OR username = ?)", [testUser.username, adminUser.username]);
    await db.query("DELETE FROM users WHERE username = ? OR username = ?", [testUser.username, adminUser.username]);
    await db.end(); // Cerrar la conexión a la base de datos
  });

  // --- GET /api/posts ---
  describe('GET /api/posts', () => {
    it('debería retornar todos los posts', async () => {
      const res = await request(app).get('/api/posts');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThanOrEqual(2); // Al menos los dos posts que creamos
      expect(res.body.some(p => p.id === testPostId)).toBeTruthy();
    });

    it('debería retornar posts filtrados por categoría', async () => {
      const res = await request(app).get('/api/posts?cat=test');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      expect(res.body.every(p => p.cat === 'test')).toBeTruthy();
    });
  });

  // --- GET /api/posts/:id ---
  describe('GET /api/posts/:id', () => {
    it('debería retornar un solo post por ID', async () => {
      const res = await request(app).get(`/api/posts/${testPostId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', testPostId);
      expect(res.body).toHaveProperty('title', 'Test Post Title');
    });

    it('debería retornar 404 si el post no se encuentra', async () => {
      const nonExistentId = 999999999;
      const res = await request(app).get(`/api/posts/${nonExistentId}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual("Post not found!");
    });
  });

  // --- POST /api/posts ---
  describe('POST /api/posts', () => {
    const newPost = {
      title: "New Post Title for Testing",
      desc: "This is a new post created by test.",
      img: "new_post_image.jpg",
      cat: "tech",
      date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    it('debería crear un nuevo post si está autenticado', async () => {
      const res = await authenticatedAgent
        .post('/api/posts')
        .send(newPost);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual("Post has been created.");

      // Verificar que se creó en la DB
      const [data] = await db.query("SELECT * FROM posts WHERE title = ?", [newPost.title]);
      expect(data.length).toBe(1);
      expect(data[0].title).toEqual(newPost.title);
      // Limpiar el post creado en esta prueba
      await db.query("DELETE FROM posts WHERE title = ?", [newPost.title]);
    });

    it('debería retornar 401 si no está autenticado', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send(newPost);
      expect(res.statusCode).toEqual(401);
      expect(res.body).toEqual("Not authenticated!");
    });
  });

  // --- DELETE /api/posts/:id ---
  describe('DELETE /api/posts/:id', () => {
    let postToDeleteId;
    let otherUserPostId;

    beforeEach(async () => {
      // Crear un post para el usuario de prueba para eliminar
      const userRes = await db.query("SELECT id FROM users WHERE username = ?", [testUser.username]);
      const userId = userRes[0][0].id;
      const [insertResult] = await db.query(
        "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`, `uid`) VALUES (?, ?, ?, ?, ?, ?)",
        ["Post to delete", "desc", "img.jpg", "test", new Date().toISOString().slice(0, 19).replace('T', ' '), userId]
      );
      postToDeleteId = insertResult.insertId;

      // Crear un post para el usuario admin para intentar eliminar con el usuario de prueba
      const adminUserRes = await db.query("SELECT id FROM users WHERE username = ?", [adminUser.username]);
      const adminUserId = adminUserRes[0][0].id;
      const [insertOtherResult] = await db.query(
        "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`, `uid`) VALUES (?, ?, ?, ?, ?, ?)",
        ["Other user's post", "desc", "img.jpg", "test", new Date().toISOString().slice(0, 19).replace('T', ' '), adminUserId]
      );
      otherUserPostId = insertOtherResult.insertId;
    });

    afterEach(async () => {
      // Asegurarse de limpiar cualquier post que no haya sido eliminado por el test
      await db.query("DELETE FROM posts WHERE id = ?", [postToDeleteId]);
      await db.query("DELETE FROM posts WHERE id = ?", [otherUserPostId]);
    });

    it('debería eliminar un post si está autenticado y es el autor', async () => {
      const res = await authenticatedAgent.delete(`/api/posts/${postToDeleteId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual("Post has been deleted");

      // Verificar que el post fue eliminado de la DB
      const [data] = await db.query("SELECT * FROM posts WHERE id = ?", [postToDeleteId]);
      expect(data.length).toBe(0);
    });

    it('debería retornar 403 si un usuario intenta eliminar el post de otro usuario', async () => {
      const res = await authenticatedAgent.delete(`/api/posts/${otherUserPostId}`);
      expect(res.statusCode).toEqual(403);
      expect(res.body).toEqual("You can delete only your post!");

      // Verificar que el post del otro usuario no fue eliminado
      const [data] = await db.query("SELECT * FROM posts WHERE id = ?", [otherUserPostId]);
      expect(data.length).toBe(1);
    });

    it('debería retornar 401 si no está autenticado', async () => {
      const res = await request(app).delete(`/api/posts/${postToDeleteId}`);
      expect(res.statusCode).toEqual(401);
      expect(res.body).toEqual("Not authenticated");

      // Verificar que el post no fue eliminado
      const [data] = await db.query("SELECT * FROM posts WHERE id = ?", [postToDeleteId]);
      expect(data.length).toBe(1);
    });

    it('debería retornar 403 si el post no existe o no pertenece al usuario autenticado (ID inválido)', async () => {
        const nonExistentId = 999999999;
        const res = await authenticatedAgent.delete(`/api/posts/${nonExistentId}`);
        expect(res.statusCode).toEqual(403); // Aunque no sea "no encontrado", la lógica de tu controlador lo trata como "no puedes borrarlo"
        expect(res.body).toEqual("You can delete only your post!");
    });
  });

  // --- PUT /api/posts/:id ---
  describe('PUT /api/posts/:id', () => {
    let postToUpdateId;
    let otherUserPostId;

    beforeEach(async () => {
      // Crear un post para el usuario de prueba para actualizar
      const userRes = await db.query("SELECT id FROM users WHERE username = ?", [testUser.username]);
      const userId = userRes[0][0].id;
      const [insertResult] = await db.query(
        "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`, `uid`) VALUES (?, ?, ?, ?, ?, ?)",
        ["Post to update", "desc", "img.jpg", "test", new Date().toISOString().slice(0, 19).replace('T', ' '), userId]
      );
      postToUpdateId = insertResult.insertId;

      // Crear un post para el usuario admin para intentar actualizar con el usuario de prueba
      const adminUserRes = await db.query("SELECT id FROM users WHERE username = ?", [adminUser.username]);
      const adminUserId = adminUserRes[0][0].id;
      const [insertOtherResult] = await db.query(
        "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`, `uid`) VALUES (?, ?, ?, ?, ?, ?)",
        ["Other user's post to update", "desc", "img.jpg", "test", new Date().toISOString().slice(0, 19).replace('T', ' '), adminUserId]
      );
      otherUserPostId = insertOtherResult.insertId;
    });

    afterEach(async () => {
      // Asegurarse de limpiar cualquier post que no haya sido eliminado por el test
      await db.query("DELETE FROM posts WHERE id = ?", [postToUpdateId]);
      await db.query("DELETE FROM posts WHERE id = ?", [otherUserPostId]);
    });

    it('debería actualizar un post si está autenticado y es el autor', async () => {
      const updatedData = {
        title: "Updated Post Title",
        desc: "Updated description.",
        img: "updated_image.jpg",
        cat: "fashion",
      };

      const res = await authenticatedAgent
        .put(`/api/posts/${postToUpdateId}`)
        .send(updatedData);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual("Post has been updated.");

      // Verificar que el post fue actualizado en la DB
      const [data] = await db.query("SELECT * FROM posts WHERE id = ?", [postToUpdateId]);
      expect(data.length).toBe(1);
      expect(data[0].title).toEqual(updatedData.title);
      expect(data[0].desc).toEqual(updatedData.desc);
      expect(data[0].img).toEqual(updatedData.img);
      expect(data[0].cat).toEqual(updatedData.cat);
    });

    it('debería retornar 403 si un usuario intenta actualizar el post de otro usuario', async () => {
      const updatedData = {
        title: "Attempt to update other's post",
        desc: "should fail",
        img: "fail.jpg",
        cat: "fail",
      };

      const res = await authenticatedAgent
        .put(`/api/posts/${otherUserPostId}`)
        .send(updatedData);

      expect(res.statusCode).toEqual(403);
      expect(res.body).toEqual("You can update only your post!");

      // Verificar que el post del otro usuario no fue actualizado
      const [data] = await db.query("SELECT * FROM posts WHERE id = ?", [otherUserPostId]);
      expect(data.length).toBe(1);
      expect(data[0].title).toEqual("Other user's post to update"); // No actualizado
    });

    it('debería retornar 401 si no está autenticado', async () => {
      const updatedData = {
        title: "Unauthorized update",
        desc: "should not happen",
        img: "unauth.jpg",
        cat: "unauth",
      };

      const res = await request(app)
        .put(`/api/posts/${postToUpdateId}`)
        .send(updatedData);

      expect(res.statusCode).toEqual(401);
      expect(res.body).toEqual("Not authenticated!");

      // Verificar que el post no fue actualizado
      const [data] = await db.query("SELECT * FROM posts WHERE id = ?", [postToUpdateId]);
      expect(data.length).toBe(1);
      expect(data[0].title).toEqual("Post to update"); // No actualizado
    });

    it('debería retornar 403 si el post no existe o no pertenece al usuario autenticado (ID inválido)', async () => {
        const nonExistentId = 999999999;
        const updatedData = {
            title: "Non-existent post update",
            desc: "should fail",
            img: "fail.jpg",
            cat: "fail",
        };
        const res = await authenticatedAgent.put(`/api/posts/${nonExistentId}`).send(updatedData);
        expect(res.statusCode).toEqual(403);
        expect(res.body).toEqual("You can update only your post!");
    });
  });
});