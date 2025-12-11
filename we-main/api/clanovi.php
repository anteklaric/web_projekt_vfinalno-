<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $stmt = $conn->prepare("DELETE FROM clanovi WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["status" => "ok"]);
    exit;
}


$stmt = $conn->query("SELECT id, ime, instrument AS uloga, slika FROM clanovi ORDER BY ime");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>