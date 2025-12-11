<?php
// api/quotes.php – SADA VRAĆA id + ime + slika
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

// Brisanje (za admina)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $stmt = $conn->prepare("DELETE FROM citati WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["status" => "ok"]);
    exit;
}

// Učitavanje citata sa svim potrebnim podacima
$stmt = $conn->query("
    SELECT 
        c.id,
        c.tekst,
        cl.ime,
        cl.slika
    FROM citati c
    LEFT JOIN clanovi cl ON c.clan_id = cl.id
    ORDER BY c.id DESC
");

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>