<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/cors.php"; 
include_once "../config/database.php";

$user_id = $_GET['utilizador_id'] ?? null;

if($user_id) {
    $stmt = $conn->prepare("SELECT p.token_pedido, pr.nome, p.status, p.data_pedido 
                             FROM pedidos p 
                             JOIN pratos pr ON p.prato_id = pr.id 
                             WHERE p.utilizador_id = ? 
                             ORDER BY p.data_pedido DESC 
                             LIMIT 10");
    $stmt->execute([$user_id]);
    echo json_encode($stmt->fetchAll());
} else {
    echo json_encode(["error" => "ID do utilizador em falta."]);
}