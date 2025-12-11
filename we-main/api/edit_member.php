<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? 0;
$ime = trim($data['ime'] ?? '');
$instrument = trim($data['instrument'] ?? '');
$slika = trim($data['slika'] ?? '');

if (!$id || !$ime || !$slika) {
    echo json_encode(["status" => "error"]);
    exit;
}

$stmt = $conn->prepare("UPDATE clanovi SET ime = ?, instrument = ?, slika = ? WHERE id = ?");
$stmt->execute([$ime, $instrument, $slika]);
echo json_encode(["status" => "ok"]);
?>