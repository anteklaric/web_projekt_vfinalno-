<?php
// api/obrisi_komentar.php – 100% RADI

header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

$input = json_decode(file_get_contents("php://input"), true);

$user_id     = $input['user_id'] ?? 0;
$komentar_id = $input['cid'] ?? 0;

if (!$user_id || !$komentar_id) {
    echo json_encode(["status" => "error", "message" => "Nedostaju podaci"]);
    exit;
}

// Provjeri je li admin
$stmt = $conn->prepare("SELECT uloga FROM korisnici WHERE id = ?");
$stmt->execute([$user_id]);
$korisnik = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$korisnik || $korisnik['uloga'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Samo admin može brisati"]);
    exit;
}

// Briši komentar
$stmt = $conn->prepare("DELETE FROM komentari WHERE id = ?");
$stmt->execute([$komentar_id]);

echo json_encode(["status" => "ok", "message" => "Komentar obrisan!"]);
?>