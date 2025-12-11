<?php
// api/toggle_favorite.php – radi za pjesme, albume i citate
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

$data    = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? 0;
$type    = $data['type'] ?? '';      // 'song', 'album', 'quote'
$item_id = $data['item_id'] ?? 0;

if (!$user_id || !$item_id || !in_array($type, ['song','album','quote'])) {
    echo json_encode(["liked" => false]);
    exit;
}

// Provjeri da li već postoji
$stmt = $conn->prepare("SELECT 1 FROM favorites WHERE user_id = ? AND type = ? AND item_id = ?");
$stmt->execute([$user_id, $type, $item_id]);
$exists = $stmt->rowCount() > 0;

if ($exists) {
    // UNLIKE
    $conn->prepare("DELETE FROM favorites WHERE user_id = ? AND type = ? AND item_id = ?")
         ->execute([$user_id, $type, $item_id]);
    
    if ($type === 'song') {
        $conn->prepare("UPDATE pjesme SET ocjene = GREATEST(ocjene - 1, 0) WHERE id = ?")
             ->execute([$item_id]);
    }
    echo json_encode(["liked" => false]);
} else {
    // LIKE
    $conn->prepare("INSERT INTO favorites (user_id, type, item_id) VALUES (?, ?, ?)")
         ->execute([$user_id, $type, $item_id]);
    
    if ($type === 'song') {
        $conn->prepare("UPDATE pjesme SET ocjene = ocjene + 1 WHERE id = ?")
             ->execute([$item_id]);
    }
    echo json_encode(["liked" => true]);
}
?>