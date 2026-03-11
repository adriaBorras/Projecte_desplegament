
CREATE DATABASE IF NOT EXISTS blog;
USE blog;

-- users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    img VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- posts
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    `desc` VARCHAR(1000) NOT NULL,
    img VARCHAR(255) DEFAULT NULL,
    cat VARCHAR(255) DEFAULT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    uid INT NOT NULL,
    FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE
);

-- fake users for example
INSERT INTO users (username, email, password, img) VALUES 
('admin', 'admin@blog.com', '$2a$10$76asdf897asdf897asdf897asdf', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=200&q=80'),
('adria', 'adria@test.com', '$2a$10$92asdf92asdf92asdf92asdf92', 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=200&q=80'),
('tester', 'test@test.com', '$2a$10$kjhaskjdhfkasjhdfkjashdfkj', 'https://images.unsplash.com/photo-1494256997604-768d1f608cdc?auto=format&fit=crop&w=200&q=80');

-- fake post for example 
INSERT INTO posts (title, `desc`, img, cat, uid) VALUES 
('Mi primer post sobre Gatos', 'En este post exploramos por qué los gatos dominan el internet y nuestras vidas.', 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=800&q=80', 'lifestyle', 1),
('Node.js y MySQL 8', 'Guía definitiva para conectar Node.js con MySQL 8 usando el driver mysql2 y autenticación segura.', 'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?auto=format&fit=crop&w=800&q=80', 'technology', 2),
('El arte de dormir 18 horas', 'Un gato experto nos cuenta sus secretos para mantener una rutina de sueño envidiable.', 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80', 'lifestyle', 1),
('Dockerizando Aplicaciones', 'Cómo empaquetar tu frontend, backend y base de datos en contenedores de forma eficiente.', 'https://images.unsplash.com/photo-1605745341112-85968b193ef5?auto=format&fit=crop&w=800&q=80', 'technology', 3);
