<?php
header("Content-Type: application/json");
require_once "db.php";

$ime = trim($_POST['ime'] ?? '');
$instrument = trim($_POST['uloga'] ?? '');
$slika = trim($_POST['slika'] ?? '');

if (empty($ime) || empty($slika)) {
    echo json_encode(["status" => "error", "message" => "Ime i slika su obavezni!"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO clanovi (ime, instrument, slika) VALUES (?, ?, ?)");
if ($stmt->execute([$ime, $instrument, $slika])) {
    echo json_encode(["status" => "ok", "message" => "Član dodan!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Greška u bazi"]);
}
?>