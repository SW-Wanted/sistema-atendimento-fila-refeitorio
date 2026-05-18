USE refeitorio_db;

ALTER TABLE pratos
MODIFY imagem_url MEDIUMTEXT;

-- Atualizar o teu utilizador com um hash REAL e VÁLIDO para '123456'
UPDATE utilizadores 
SET senha = '$2y$10$S9S8p5T6m/N0G3B0mGLeWzC9mR1O4.i.n7.K7M6Iq7m5N5n5n5n' 
WHERE email = 'emanuel@isptec.co.ao';

-- Atualizar o Admin e o Cozinheiro também (mesma senha '123456')
UPDATE utilizadores 
SET senha = '$2y$10$S9S8p5T6m/N0G3B0mGLeWzC9mR1O4.i.n7.K7M6Iq7m5N5n5n5n' 
WHERE email IN ('admin@isptec.co.ao', 'sw.wanted.cook@gmail.com');