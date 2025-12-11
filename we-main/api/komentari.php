<?php
// api/komentari.php – KONAČNA VERZIJA (komentari se vide odmah)

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

// DODAVANJE – odmah odobren
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $user_id = $data['user_id'] ?? 0;
    $tip     = $data['tip'] ?? '';
    $item_id = $data['item_id'] ?? 0;
    $tekst   = trim($data['tekst'] ?? '');

    if (!$user_id || !$tip || !$item_id || !$tekst) {
        echo json_encode(["status" => "error", "message" => "Greška"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO komentari (korisnik_id, tip, item_id, tekst, odobren) VALUES (?, ?, ?, ?, 1)");
    $stmt->execute([$user_id, $tip, $item_id, $tekst]);

    echo json_encode(["status" => "ok", "message" => "Komentar poslan!"]);
    exit;
}

// PRIKAZ – svi komentari (odobreni ili ne – jer ih više ne čekamo)
$tip     = $_GET['tip'] ?? '';
$item_id = (int)($_GET['item_id'] ?? 0);

if (!$tip || !$item_id) {
    echo json_encode([]);
    exit;
}

$stmt = $conn->prepare("
    SELECT k.tekst, k.datum, u.ime 
    FROM komentari k 
    JOIN korisnici u ON k.korisnik_id = u.id 
    WHERE k.tip = ? AND k.item_id = ? 
    ORDER BY k.datum DESC
");
$stmt->execute([$tip, $item_id]);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>