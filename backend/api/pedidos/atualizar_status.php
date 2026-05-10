<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/cors.php"; 
include_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"));

// status pode ser: 'preparacao', 'pronto', 'retirado'
if(!empty($data->pedido_id) && !empty($data->novo_status)) {
    $query = "UPDATE pedidos SET status = :status WHERE id = :id";
    $stmt = $conn->prepare($query);
    
    if($stmt->execute([':status' => $data->novo_status, ':id' => $data->pedido_id])) {
        echo json_encode(["message" => "Status atualizado para " . $data->novo_status]);
    }
}
