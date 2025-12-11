<?php
// api/user_favorites.php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

$user_id = (int)($_GET['user_id'] ?? 0);
if (!$user_id) {
    echo json_encode(["songs" => [], "albums" => [], "quotes" => []]);
    exit;
}

$out = ["songs" => [], "albums" => [], "quotes" => []];

// Pjesme
$stmt = $conn->prepare("SELECT item_id FROM favorites WHERE user_id = ? AND type = 'song'");
$stmt->execute([$user_id]);
while ($row = $stmt->fetchColumn()) $out['songs'][] = (int)$row;

// Albumi
$stmt = $conn->prepare("SELECT item_id FROM favorites WHERE user_id = ? AND type = 'album'");
$stmt->execute([$user_id]);
while ($row = $stmt->fetchColumn()) $out['albums'][] = (int)$row;

// Citati
$stmt = $conn->prepare("SELECT item_id FROM favorites WHERE user_id = ? AND type = 'quote'");
$stmt->execute([$user_id]);
while ($row = $stmt->fetchColumn()) $out['quotes'][] = (int)$row;

echo json_encode($out);
?>