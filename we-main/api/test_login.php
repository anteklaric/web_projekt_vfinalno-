<?php
require_once "db.php";
$hash = password_hash("12345", PASSWORD_DEFAULT);
echo "Hash za 12345: " . $hash . "<br>";

// Testiraj admina
$stmt = $conn->prepare("SELECT ime, lozinka, uloga FROM korisnici WHERE uloga = 'admin' LIMIT 1");
$stmt->execute();
$user = $stmt->fetch();
echo "Admin u bazi: " . $user['ime'] . "<br>";
echo "Hash u bazi: " . $user['lozinka'] . "<br>";
echo "password_verify('12345', hash) = " . (password_verify("12345", $user['lozinka']) ? "DA" : "NE");
?>