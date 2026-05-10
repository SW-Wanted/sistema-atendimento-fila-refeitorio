<?php
// 1. Cabeçalhos CORS (Devem vir ANTES de qualquer output)
header("Access-Control-Allow-Origin: http://localhost:4200"); // Origem do Angular
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// 2. Tratar o Preflight (O "aperto de mão" do browser)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");

include_once "../config/database.php";

// Resto do código do login...
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->senha)) {
    $query = "SELECT * FROM utilizadores WHERE email = :email";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":email", $data->email);
    $stmt->execute();
    $user = $stmt->fetch();

    if($user && password_verify($data->senha, $user['senha'])) {
        unset($user['senha']);
        http_response_code(200);
        echo json_encode([
            "message" => "Login realizado com sucesso.",
            "user" => $user
        ]);
    } else {
        error_log("Tentativa de login para: " . $data->email);
        error_log("Senha enviada: " . $data->senha);
        error_log("Hash no DB: " . $user['senha']);

        http_response_code(401);
        echo json_encode(["message" => "Email ou senha incorretos."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos."]);
}