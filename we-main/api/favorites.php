<?php
// api/favorites.php – SADA VRAĆA PJESME + ALBUME + CITATE SA SLIKAMA
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

$user_id = (int)($_GET['user_id'] ?? 0);
if (!$user_id) {
    echo json_encode(["songs" => [], "albums" => [], "quotes" => []]);
    exit;
}

$response = ["songs" => [], "albums" => [], "quotes" => []];

// PJESME
$stmt = $conn->prepare("
    SELECT p.naziv, p.trajanje, a.naziv AS album_naziv, a.slika AS album_slika
    FROM favorites f
    JOIN pjesme p ON f.item_id = p.id
    JOIN albumi a ON p.album_id = a.id
    WHERE f.user_id = ? AND f.type = 'song'
");
$stmt->execute([$user_id]);
$response['songs'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

// ALBUMI
$stmt = $conn->prepare("
    SELECT a.naziv, a.godina, a.slika
    FROM favorites f
    JOIN albumi a ON f.item_id = a.id
    WHERE f.user_id = ? AND f.type = 'album'
");
$stmt->execute([$user_id]);
$response['albums'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

// CITATI + SLIKA ČLANA
$stmt = $conn->prepare("
    SELECT c.tekst, cl.ime, cl.slika
    FROM favorites f
    JOIN citati c ON f.item_id = c.id
    LEFT JOIN clanovi cl ON c.clan_id = cl.id
    WHERE f.user_id = ? AND f.type = 'quote'
");
$stmt->execute([$user_id]);
$response['quotes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>