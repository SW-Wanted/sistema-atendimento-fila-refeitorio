CREATE DATABASE IF NOT EXISTS refeitorio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE refeitorio_db;

-- 1. Tabela de Utilizadores (Estudantes, Funcionários, etc.)
CREATE TABLE utilizadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, -- Guardaremos hash
    tipo_conta ENUM('institucional', 'guest', 'operador', 'admin') DEFAULT 'institucional',
    saldo DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Pratos (Catálogo de Refeições)
CREATE TABLE pratos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    categoria ENUM('carne', 'peixe', 'vegetariano', 'dieta') NOT NULL,
    disponivel BOOLEAN DEFAULT TRUE,
    imagem_url MEDIUMTEXT
);

-- 3. Tabela de Pedidos (A ligação entre Utilizador e Prato)
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilizador_id INT,
    prato_id INT,
    token_pedido VARCHAR(10) UNIQUE NOT NULL, -- O "número do pedido"
    status ENUM('recebido', 'preparacao', 'pronto', 'retirado') DEFAULT 'recebido',
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id),
    FOREIGN KEY (prato_id) REFERENCES pratos(id)
);