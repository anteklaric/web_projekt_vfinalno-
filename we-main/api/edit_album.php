<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? 0;
$naziv = trim($data['naziv'] ?? '');
$godina = $data['godina'] ?? '';
$slika = trim($data['slika'] ?? '');

if (!$id || !$naziv || !$godina) {
    echo json_encode(["status" => "error"]);
    exit;
}

$stmt = $conn->prepare("UPDATE albumi SET naziv = ?, godina = ?, slika = ? WHERE id = ?");
$stmt->execute([$naziv, $godina, $slika, $id]);
echo json_encode(["status" => "ok"]);
?>