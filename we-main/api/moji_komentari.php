<?php
// api/moji_komentari.php – prikazuje sve komentare korisnika
header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

$user_id = (int)($_GET['user_id'] ?? 0);
if (!$user_id) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT k.tekst, k.datum, k.tip, k.item_id,
               cl.ime AS clan_ime,
               q.tekst AS quote_tekst,
               a.naziv AS album_naziv
        FROM komentari k
        LEFT JOIN clanovi cl ON k.tip = 'member' AND k.item_id = cl.id
        LEFT JOIN citati q ON k.tip = 'quote' AND k.item_id = q.id
        LEFT JOIN albumi a ON k.tip = 'album' AND k.item_id = a.id
        WHERE k.korisnik_id = ?
        ORDER BY k.datum DESC
    ");
    $stmt->execute([$user_id]);
    $komentari = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Dodaj opis gdje je komentar napisan
    foreach ($komentari as &$k) {
        if ($k['tip'] === 'member') $k['gdje'] = "na članu: " . $k['clan_ime'];
        if ($k['tip'] === 'quote') $k['gdje'] = "na citatu: " . substr($k['quote_tekst'], 0, 50) . "...";
        if ($k['tip'] === 'album') $k['gdje'] = "na albumu: " . $k['album_naziv'];
    }

    echo json_encode($komentari);
} catch (Exception $e) {
    echo json_encode([]);
}
?>