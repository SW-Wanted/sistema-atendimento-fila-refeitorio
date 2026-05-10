<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

include_once "../config/cors.php";
include_once "../config/database.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (empty($data->utilizador_id) || !isset($data->valor)) {
    http_response_code(400);
    echo json_encode(["message" => "Utilizador e valor são obrigatórios."]);
    exit();
}

$utilizadorId = (int) $data->utilizador_id;
$valor = (float) $data->valor;

if ($valor <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "O valor de carregamento tem de ser maior que zero."]);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT saldo FROM utilizadores WHERE id = ?");
    $stmt->execute([$utilizadorId]);
    $utilizador = $stmt->fetch();

    if (!$utilizador) {
        http_response_code(404);
        echo json_encode(["message" => "Utilizador não encontrado."]);
        exit();
    }

    $novoSaldo = (float) $utilizador['saldo'] + $valor;
    $update = $conn->prepare("UPDATE utilizadores SET saldo = ? WHERE id = ?");
    $update->execute([$novoSaldo, $utilizadorId]);

    http_response_code(200);
    echo json_encode([
        "message" => "Saldo carregado com sucesso.",
        "novo_saldo" => $novoSaldo
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao carregar saldo: " . $e->getMessage()]);
}
