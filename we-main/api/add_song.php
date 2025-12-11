<?php
// api/add_song.php – sprema PRAVI tekst pjesme (ne link)
header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

$album_id = (int)($_POST['album_id'] ?? 0);
$naziv    = trim($_POST['naziv'] ?? '');
$trajanje = trim($_POST['trajanje'] ?? '');
$tekst    = trim($_POST['tekst'] ?? ''); // sada je ovo tekst, ne URL

if (!$album_id || !$naziv || !$trajanje) {
    echo json_encode(["status" => "error", "message" => "Album, naziv i trajanje su obavezni!"]);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO pjesme (album_id, naziv, trajanje, tekst) VALUES (?, ?, ?, ?)");
    $stmt->execute([$album_id, $naziv, $trajanje, $tekst]);
    echo json_encode(["status" => "ok", "message" => "Pjesma dodana!"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Greška: " . $e->getMessage()]);
}
?>