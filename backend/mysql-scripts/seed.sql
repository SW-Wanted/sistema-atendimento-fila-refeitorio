USE refeitorio_db;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE pedidos;
TRUNCATE TABLE pratos;
TRUNCATE TABLE utilizadores;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO utilizadores (nome, email, senha, tipo_conta, saldo) VALUES
('Emanuel dos Santos', 'emanuel@isptec.co.ao', '$2y$10$S9S8p5T6m/N0G3B0mGLeWzC9mR1O4.i.n7.K7M6Iq7m5N5n5n5n', 'institucional', 5000.00),
('Judson Paiva', 'admin@isptec.co.ao', '$2y$10$S9S8p5T6m/N0G3B0mGLeWzC9mR1O4.i.n7.K7M6Iq7m5N5n5n5n', 'admin', 0.00),
('SW Wanted', 'sw.wanted.cook@gmail.com', '$2y$10$S9S8p5T6m/N0G3B0mGLeWzC9mR1O4.i.n7.K7M6Iq7m5N5n5n5n', 'operador', 0.00);

INSERT INTO pratos (nome, descricao, preco, categoria, disponivel) VALUES
('Mufete de Cacuso', 'Peixe grelhado com feijão de óleo de palma e farinha torrada.', 2500.00, 'peixe', 1),
('Calulu de Carne Seca', 'Tradicional calulu com legumes e funge.', 2200.00, 'carne', 1),
('Arroz de Legumes', 'Opção vegetariana com legumes frescos da época.', 1500.00, 'vegetariano', 1),
('Frango Grelhado', 'Peito de frango com salada russa.', 1800.00, 'dieta', 1);