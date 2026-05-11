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

if (empty($data->email) || empty($data->nova_senha)) {
    http_response_code(400);
    echo json_encode(["message" => "Email e nova senha são obrigatórios."]);
    exit;
}

$query = "SELECT id FROM utilizadores WHERE email = :email LIMIT 1";
$stmt = $conn->prepare($query);
$stmt->bindParam(":email", $data->email);
$stmt->execute();
$user = $stmt->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(["message" => "Conta não encontrada para o email informado."]);
    exit;
}

$senhaHash = password_hash($data->nova_senha, PASSWORD_BCRYPT);
$update = $conn->prepare("UPDATE utilizadores SET senha = :senha WHERE id = :id");
$update->bindParam(":senha", $senhaHash);
$update->bindParam(":id", $user['id']);

if ($update->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "Senha atualizada com sucesso."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Não foi possível atualizar a senha."]);
}
