<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? 0;
$naziv = trim($data['naziv'] ?? '');
$trajanje = trim($data['trajanje'] ?? '');
$tekst = trim($data['tekst'] ?? '');

if (!$id || !$naziv) {
    echo json_encode(["status" => "error"]);
    exit;
}

$stmt = $conn->prepare("UPDATE pjesme SET naziv = ?, trajanje = ?, tekst = ? WHERE id = ?");
$stmt->execute([$naziv, $trajanje, $tekst, $id]);
echo json_encode(["status" => "ok"]);
?>