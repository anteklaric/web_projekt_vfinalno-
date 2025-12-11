<?php
// api/members.php – 100% ISPRAVNO, SVE RADI (brisanje + citati + strani ključevi)

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/db.php";

// ========================================
// BRISANJE ČLANA (DELETE metoda)
// ========================================
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];

    try {
        // 1. Obriši sve citate tog člana (da ne blokira foreign key)
        $conn->prepare("DELETE FROM citati WHERE clan_id = ?")->execute([$id]);

        // 2. Obriši člana
        $stmt = $conn->prepare("DELETE FROM clanovi WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(["status" => "ok"]);
    } catch (Exception $e) {
        http_response_code(500);
        // OVO JE BILA GREŠKA: falila je točka!
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
    exit;
}

// ========================================
// UČITAVANJE SVIH ČLANOVA (GET metoda)
// ========================================
try {
    $stmt = $conn->query("SELECT id, ime, instrument, biografija, slika FROM clanovi ORDER BY ime");
    $members = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($members ?: [], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Greška u bazi: " . $e->getMessage()]);
}
?>