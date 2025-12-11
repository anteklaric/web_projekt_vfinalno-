<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: 0");
header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? 0;
$album_id = $data['album_id'] ?? 0;

if (!$user_id || !$album_id) exit(json_encode(["error"=>"bad"]));

// Ako već postoji → ne radi ništa
$stmt = $conn->prepare("SELECT 1 FROM favorites WHERE user_id = ? AND type = 'album' AND item_id = ?");
$stmt->execute([$user_id, $album_id]);

if ($stmt->rowCount() == 0) {
    $conn->prepare("INSERT INTO favorites (user_id, type, item_id) VALUES (?, 'album', ?)")
         ->execute([$user_id, $album_id]);
}

echo json_encode(["liked" => true]);
?>