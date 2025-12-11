<?php
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/db.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->query("SELECT id, naziv, godina, opis, slika FROM albumi ORDER BY godina DESC");
        $albums = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($albums ?: [], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $naziv = $_POST['naziv'] ?? '';
    $godina = $_POST['godina'] ?? '';
    $opis = $_POST['opis'] ?? '';
    $slika = $_POST['slika'] ?? '';

    $stmt = $conn->prepare("INSERT INTO albumi (naziv, godina, opis, slika) VALUES (?, ?, ?, ?)");
    if ($stmt->execute([$naziv, $godina, $opis, $slika])) {
        echo json_encode(["message" => "Album uspješno dodan"]);
    } else {
        echo json_encode(["message" => "Greška pri dodavanju albuma"]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $stmt = $conn->prepare("DELETE FROM albumi WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Album obrisan"]);
    exit;
}
?>