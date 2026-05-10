<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/cors.php"; 
include_once "../config/database.php";

// Busca pedidos que ainda não foram entregues, ordenados por tempo
$query = "SELECT p.id, p.token_pedido, p.status, pr.nome as prato, u.nome as cliente, p.data_pedido 
          FROM pedidos p
          JOIN pratos pr ON p.prato_id = pr.id
          JOIN utilizadores u ON p.utilizador_id = u.id
          WHERE p.status != 'retirado'
          ORDER BY p.data_pedido ASC";

$stmt = $conn->prepare($query);
$stmt->execute();
echo json_encode($stmt->fetchAll());
