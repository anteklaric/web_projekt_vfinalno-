<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $stmt = $conn->prepare("DELETE FROM citati WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["status" => "ok"]);
    exit;
}

$stmt = $conn->query("
    SELECT c.id, c.tekst, cl.ime AS ime_clana 
    FROM citati c 
    LEFT JOIN clanovi cl ON c.clan_id = cl.id 
    ORDER BY c.id DESC
");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>