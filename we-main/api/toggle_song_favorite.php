<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: 0");
header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? 0;
$song_id = $data['song_id'] ?? 0;

if (!$user_id || !$song_id) {
    echo json_encode(["error" => "Nedostaju podaci"]);
    exit;
}

// Provjeri da li već postoji – ako da, ne radi ništa (ne dozvoli unlike)
$stmt = $conn->prepare("SELECT 1 FROM favorites WHERE user_id = ? AND type = 'song' AND item_id = ?");
$stmt->execute([$user_id, $song_id]);

if ($stmt->rowCount() > 0) {
    // Već lajkano → ne radi ništa, samo vrati da je lajkano
    echo json_encode(["liked" => true]);
} else {
    // Nije lajkano → dodaj u favorites + povećaj ocjene
    $conn->beginTransaction();
    $conn->prepare("INSERT INTO favorites (user_id, type, item_id) VALUES (?, 'song', ?)")
         ->execute([$user_id, $song_id]);
    $conn->prepare("UPDATE pjesme SET ocjene = ocjene + 1 WHERE id = ?")
         ->execute([$song_id]);
    $conn->commit();
    echo json_encode(["liked" => true]);
}
?>