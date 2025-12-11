<?php
// api/songs.php – UČITAVANJE + BRISANJE PJESME
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/db.php";

// ========================================
// BRISANJE PJESME
// ========================================
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    try {
        $stmt = $conn->prepare("DELETE FROM pjesme WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["status" => "ok"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
    exit;
}

// ========================================
// UČITAVANJE PJESAMA PO ALBUMU
// ========================================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['album_id'])) {
    $aid = (int)$_GET['album_id'];
    $stmt = $conn->prepare("SELECT id, naziv, trajanje, ocjene FROM pjesme WHERE album_id = ? ORDER BY naziv");
    $stmt->execute([$aid]);
    $pjesme = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($pjesme ?: [], JSON_UNESCAPED_UNICODE);
    exit;
}

// ========================================
// UČITAVANJE TEKSTA PJESME
// ========================================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $stmt = $conn->prepare("SELECT tekst FROM pjesme WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $tekst = $row ? ($row['tekst'] ?: "Tekst nije dostupan.") : "Tekst nije dostupan.";
    echo json_encode(["tekst" => $tekst], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Metoda nije dozvoljena"]);
?>