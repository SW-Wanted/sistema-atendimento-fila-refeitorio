<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

include_once "../config/cors.php"; 
include_once "../config/database.php";

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$payload = json_decode(file_get_contents("php://input"), true) ?? [];

function respond_not_found(string $message = 'Prato não encontrado.'): void {
    http_response_code(404);
    echo json_encode(["message" => $message]);
    exit();
}

function respond_bad_request(string $message): void {
    http_response_code(400);
    echo json_encode(["message" => $message]);
    exit();
}

switch($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;

        if ($id) {
            $stmt = $conn->prepare("SELECT * FROM pratos WHERE id = ?");
            $stmt->execute([$id]);
            $prato = $stmt->fetch();

            if (!$prato) {
                respond_not_found();
            }

            echo json_encode($prato);
            break;
        }

        $stmt = $conn->query("SELECT * FROM pratos ORDER BY id DESC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        if (empty($payload['nome']) || empty($payload['preco']) || empty($payload['categoria'])) {
            respond_bad_request('Nome, preço e categoria são obrigatórios.');
        }

        $descricao = $payload['descricao'] ?? '';
        $disponivel = array_key_exists('disponivel', $payload) ? (int) (bool) $payload['disponivel'] : 1;
        $imagemUrl = $payload['imagem_url'] ?? null;

        $stmt = $conn->prepare(
            "INSERT INTO pratos (nome, descricao, preco, categoria, disponivel, imagem_url) VALUES (?, ?, ?, ?, ?, ?)"
        );

        if($stmt->execute([
            trim($payload['nome']),
            trim($descricao),
            $payload['preco'],
            $payload['categoria'],
            $disponivel,
            $imagemUrl
        ])) {
            http_response_code(201);
            echo json_encode([
                "message" => "Prato adicionado.",
                "id" => (int)$conn->lastInsertId()
            ]);
            break;
        }

        http_response_code(500);
        echo json_encode(["message" => "Não foi possível adicionar o prato."]);
        break;

    case 'PUT':
        $id = $payload['id'] ?? $_GET['id'] ?? null;

        if (!$id) {
            respond_bad_request('ID do prato é obrigatório.');
        }

        $stmt = $conn->prepare("SELECT * FROM pratos WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            respond_not_found();
        }

        $fields = [];
        $values = [];

        foreach (['nome', 'descricao', 'preco', 'categoria', 'imagem_url'] as $field) {
            if (array_key_exists($field, $payload)) {
                $fields[] = "{$field} = ?";
                $values[] = $payload[$field];
            }
        }

        if (array_key_exists('disponivel', $payload)) {
            $fields[] = "disponivel = ?";
            $values[] = (int)(bool)$payload['disponivel'];
        }

        if (!$fields) {
            respond_bad_request('Nenhum campo válido foi enviado para atualização.');
        }

        $values[] = $id;
        $stmt = $conn->prepare("UPDATE pratos SET " . implode(', ', $fields) . " WHERE id = ?");

        if ($stmt->execute($values)) {
            echo json_encode(["message" => "Prato atualizado."]);
            break;
        }

        http_response_code(500);
        echo json_encode(["message" => "Não foi possível atualizar o prato."]);
        break;

    case 'PATCH':
        $id = $payload['id'] ?? $_GET['id'] ?? null;
        if (!$id || !array_key_exists('disponivel', $payload)) {
            respond_bad_request('ID e status de disponibilidade são obrigatórios.');
        }

        $stmt = $conn->prepare("UPDATE pratos SET disponivel = ? WHERE id = ?");
        if ($stmt->execute([(int)(bool)$payload['disponivel'], $id])) {
            echo json_encode(["message" => "Disponibilidade atualizada."]);
            break;
        }

        http_response_code(500);
        echo json_encode(["message" => "Não foi possível atualizar a disponibilidade."]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? $payload['id'] ?? null;

        if (!$id) {
            respond_bad_request('ID do prato é obrigatório.');
        }

        $stmt = $conn->prepare("DELETE FROM pratos WHERE id = ?");
        if($stmt->execute([$id])) {
            echo json_encode(["message" => "Prato removido."]);
            break;
        }

        http_response_code(500);
        echo json_encode(["message" => "Não foi possível remover o prato."]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Método não suportado."]);
}