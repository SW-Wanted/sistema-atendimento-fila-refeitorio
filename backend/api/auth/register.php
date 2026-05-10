<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->nome) && !empty($data->email) && !empty($data->senha)) {
    try {
        $query = "INSERT INTO utilizadores (nome, email, senha, tipo_conta) VALUES (:nome, :email, :senha, :tipo)";
        $stmt = $conn->prepare($query);

        $password_hash = password_hash($data->senha, PASSWORD_BCRYPT);
        $tipo = "institucional";

        $stmt->bindParam(":nome", $data->nome);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":senha", $password_hash);
        $stmt->bindParam(":tipo", $tipo);

        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Utilizador criado com sucesso."]);
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Erro: " . $e->getMessage()]);
    }
}
