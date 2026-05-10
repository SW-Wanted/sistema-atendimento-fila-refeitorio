<?php
// Cabeçalhos obrigatórios para API REST
header("Access-Control-Allow-Origin: *"); // Permite que o Angular (localhost:4200) aceda
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/cors.php"; 
include_once "../config/database.php";

try {
    $query = "SELECT * FROM pratos WHERE disponivel = 1";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $pratos = $stmt->fetchAll();

    http_response_code(200);
    echo json_encode($pratos);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao buscar pratos: " . $e->getMessage()]);
}
?>
