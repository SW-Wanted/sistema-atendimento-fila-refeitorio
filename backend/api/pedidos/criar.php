<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/cors.php"; 
include_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"));

// 1. Validar saldo e disponibilidade (Regra de Negócio)
try {
    $conn->beginTransaction();

    // Buscar preço do prato
    $stmtPrato = $conn->prepare("SELECT preco FROM pratos WHERE id = ? AND disponivel = 1");
    $stmtPrato->execute([$data->prato_id]);
    $prato = $stmtPrato->fetch();

    // Buscar saldo do utilizador
    $stmtUser = $conn->prepare("SELECT saldo FROM utilizadores WHERE id = ?");
    $stmtUser->execute([$data->utilizador_id]);
    $user = $stmtUser->fetch();

    if(!$prato) throw new Exception("Prato indisponível.");
    if($user['saldo'] < $prato['preco']) throw new Exception("Saldo insuficiente.");

    // 2. Gerar Token Único (ex: R-102)
    $token = "R-" . rand(100, 999);

    // 3. Deduzir Saldo
    $novoSaldo = $user['saldo'] - $prato['preco'];
    $updSaldo = $conn->prepare("UPDATE utilizadores SET saldo = ? WHERE id = ?");
    $updSaldo->execute([$novoSaldo, $data->utilizador_id]);

    // 4. Criar Pedido
    $insPedido = $conn->prepare("INSERT INTO pedidos (utilizador_id, prato_id, token_pedido, status) VALUES (?, ?, ?, 'recebido')");
    $insPedido->execute([$data->utilizador_id, $data->prato_id, $token]);

    $conn->commit();
    echo json_encode(["message" => "Pedido realizado!", "token" => $token, "novo_saldo" => $novoSaldo]);

} catch(Exception $e) {
    $conn->rollBack();
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}
