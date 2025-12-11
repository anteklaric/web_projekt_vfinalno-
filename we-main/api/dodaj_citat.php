<?php
header("Content-Type: application/json");
require_once "db.php";

$tekst = trim($_POST['tekst'] ?? '');
$clan_id = (int)($_POST['clan_id'] ?? 0);

if (empty($tekst) || $clan_id <= 0) {
    echo json_encode(["status" => "error", "message" => "Odaberi člana i tekst!"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO citati (tekst, clan_id) VALUES (?, ?)");
if ($stmt->execute([$tekst, $clan_id])) {
    echo json_encode(["status" => "ok", "message" => "Citat dodan!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Greška"]);
}
?>