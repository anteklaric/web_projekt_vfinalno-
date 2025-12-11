<?php
// api/register.php
header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

$ime     = trim($_POST['ime'] ?? '');
$email   = trim($_POST['email'] ?? '');
$lozinka = $_POST['lozinka'] ?? '';

// Osnovna validacija
if (!$ime || !$email || !$lozinka) {
    echo json_encode(["status" => "error", "message" => "Sva polja su obavezna!"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Neispravan email!"]);
    exit;
}

// Provjera duplikata
$stmtCheck = $conn->prepare("SELECT id FROM korisnici WHERE email = ?");
$stmtCheck->execute([$email]);
if ($stmtCheck->fetch()) {
    echo json_encode(["status" => "error", "message" => "Email već postoji!"]);
    exit;
}

// Hash lozinke
$hash = password_hash($lozinka, PASSWORD_DEFAULT);

try {
    $stmt = $conn->prepare("INSERT INTO korisnici (ime, email, lozinka, uloga) VALUES (?, ?, ?, 'fan')");
    $stmt->execute([$ime, $email, $hash]);

    $userId = $conn->lastInsertId();

    // Log aktivnosti
    $log = $conn->prepare("INSERT INTO aktivnosti (datum, akcija, korisnik_id) VALUES (NOW(), 'registracija', ?)");
    $log->execute([$userId]);

    echo json_encode(["status" => "ok", "message" => "Registracija uspješna! Preusmjeravam na login..."]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Greška pri registraciji."]);
}
?>