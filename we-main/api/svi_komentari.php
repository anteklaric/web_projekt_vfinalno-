<?php
// api/svi_komentari.php – PRIKAZUJE SVE KOMENTARE ZA ADMINA (100% RADI)

header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

try {
    $stmt = $stmt = $conn->query("
        SELECT 
            k.id,
            k.tekst,
            k.datum,
            k.tip,
            k.item_id,
            u.ime AS ime_korisnika,
            COALESCE(cl.ime, q.tekst, a.naziv, 'Nepoznato') AS gdje_naziv
        FROM komentari k
        JOIN korisnici u ON k.korisnik_id = u.id
        LEFT JOIN clanovi cl ON k.tip = 'member' AND k.item_id = cl.id
        LEFT JOIN citati q   ON k.tip = 'quote' AND k.item_id = q.id
        LEFT JOIN albumi a   ON k.tip = 'album' AND k.item_id = a.id
        ORDER BY k.datum DESC
    ");

    $komentari = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Dodaj ljudski čitljiv opis gdje je komentar
    foreach ($komentari as &$k) {
        $k['opis'] = match($k['tip']) {
            'member' => "član: " . $k['gdje_naziv'],
            'quote'  => "citat: " . substr($k['gdje_naziv'], 0, 50) . (strlen($k['gdje_naziv']) > 50 ? '...' : ''),
            'album'  => "album: " . $k['gdje_naziv'],
            default  => "nepoznato"
        };
    }

    echo json_encode($komentari);
} catch (Exception $e) {
    echo json_encode([]);
}
?>