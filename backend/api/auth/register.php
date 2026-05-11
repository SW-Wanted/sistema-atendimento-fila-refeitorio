<?php
include_once "../config/cors.php";
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->nome) && !empty($data->email) && !empty($data->senha)) {
    try {
        $tipo = !empty($data->tipo_conta) ? $data->tipo_conta : "institucional";
        if (!in_array($tipo, ["institucional", "guest", "operador", "admin"])) {
            $tipo = "institucional";
        }

        $query = "INSERT INTO utilizadores (nome, email, senha, tipo_conta) VALUES (:nome, :email, :senha, :tipo)";
        $stmt = $conn->prepare($query);

        $password_hash = password_hash($data->senha, PASSWORD_BCRYPT);

        $stmt->bindParam(":nome", $data->nome);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":senha", $password_hash);
        $stmt->bindParam(":tipo", $tipo);

        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Utilizador criado com sucesso."]);
        }
    } catch(PDOException $e) {
        if ($e->getCode() === '23000') {
            http_response_code(409);
            echo json_encode(["message" => "Já existe uma conta com este email."]);
            exit;
        }

        http_response_code(500);
        echo json_encode(["message" => "Erro interno ao criar utilizador."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos para registo."]);
}
