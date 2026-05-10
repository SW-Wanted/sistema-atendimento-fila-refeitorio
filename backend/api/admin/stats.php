<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/cors.php"; 
include_once "../config/database.php";

try {
    // 1. Total de pedidos hoje
    $hoje = date('Y-m-d');
    $stmt1 = $conn->prepare("SELECT COUNT(*) as total FROM pedidos WHERE DATE(data_pedido) = ?");
    $stmt1->execute([$hoje]);
    $total_pedidos = $stmt1->fetch()['total'];

    // 2. Receita total hoje
    $stmt2 = $conn->prepare("SELECT SUM(pr.preco) as receita FROM pedidos p 
                             JOIN pratos pr ON p.prato_id = pr.id 
                             WHERE DATE(p.data_pedido) = ?");
    $stmt2->execute([$hoje]);
    $receita_hoje = $stmt2->fetch()['receita'] ?? 0;

    // 3. Prato mais pedido (Top 1)
    $stmt3 = $conn->prepare("SELECT pr.nome, COUNT(p.id) as qtd FROM pedidos p 
                             JOIN pratos pr ON p.prato_id = pr.id 
                             GROUP BY p.prato_id ORDER BY qtd DESC LIMIT 1");
    $stmt3->execute();
    $prato_popular = $stmt3->fetch();

    // 4. Distribuição por Status (Para gráfico de pizza no Angular)
    $stmt4 = $conn->prepare("SELECT status, COUNT(*) as qtd FROM pedidos GROUP BY status");
    $stmt4->execute();
    $status_dist = $stmt4->fetchAll();

    $stmt5 = $conn->prepare("SELECT COUNT(*) as total FROM pratos WHERE disponivel = 1");
    $stmt5->execute();
    $pratos_disponiveis = $stmt5->fetch()['total'];

    $stmt6 = $conn->prepare("SELECT COUNT(*) as total FROM utilizadores");
    $stmt6->execute();
    $total_utilizadores = $stmt6->fetch()['total'];

    echo json_encode([
        "pedidos_hoje" => $total_pedidos,
        "receita_hoje" => (float)$receita_hoje,
        "prato_mais_vendido" => $prato_popular,
        "distribuicao_status" => $status_dist,
        "pratos_disponiveis" => (int)$pratos_disponiveis,
        "total_utilizadores" => (int)$total_utilizadores
    ]);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}