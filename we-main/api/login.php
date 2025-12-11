<?php
// api/login.php – 100% RADI SA HASHIRANIM LOZINKAMA (OBAVEZNO OVAKO!)
header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

$login    = trim($_POST['login'] ?? '');
$lozinka  = $_POST['lozinka'] ?? '';

if (!$login || !$lozinka) {
    echo json_encode(["status" => "error", "message" => "Popuni sva polja!"]);
    exit;
}

try {
    // Traži po emailu ILI po imenu
    $stmt = $conn->prepare("SELECT id, ime, email, lozinka, uloga FROM korisnici WHERE email = ? OR ime = ? LIMIT 1");
    $stmt->execute([$login, $login]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($lozinka, $user['lozinka'])) {
        // USPJEŠAN LOGIN
        unset($user['lozinka']); // nikad ne šalji hash

        // Logiraj aktivnost
        $log = $conn->prepare("INSERT INTO aktivnosti (datum, akcija, korisnik_id) VALUES (NOW(), 'login', ?)");
        $log->execute([$user['id']]);

        echo json_encode([
            "status"  => "ok",
            "message" => "Dobrodošao, " . $user['ime'] . "!",
            "user"    => $user
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Pogrešna lozinka ili korisničko ime!"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Greška na serveru"]);
}
?>