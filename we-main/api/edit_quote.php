<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? 0;
$tekst = trim($data['tekst'] ?? '');
$clan_id = $data['clan_id'] ?? 0;

if (!$id || !$tekst) {
    echo json_encode(["status" => "error"]);
    exit;
}

$stmt = $conn->prepare("UPDATE citati SET tekst = ?, clan_id = ? WHERE id = ?");
$stmt->execute([$tekst, $clan_id ?: null, $id]);
echo json_encode(["status" => "ok"]);
?>