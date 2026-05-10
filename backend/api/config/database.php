<?php
$host = "localhost";
$db_name = "refeitorio_db";
$username = "root";
$password = "admin"; // Garante que a senha está correta

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch(PDOException $exception) {
    header('Content-Type: application/json');
    echo json_encode(["error" => "Falha na conexão: " . $exception->getMessage()]);
    exit;
}
?>