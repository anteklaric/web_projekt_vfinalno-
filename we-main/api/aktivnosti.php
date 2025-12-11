<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require_once "db.php";

try {
    $stmt = $conn->query("
        SELECT 
            DATE(last_login) as dan, 
            COUNT(*) as broj 
        FROM korisnici 
        WHERE last_login >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(last_login)
        ORDER BY dan
    ");
    $rez = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $labels = ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"];
    $values = array_fill(0, 7, 0);

    foreach ($rez as $row) {
        $diff = (int)date_diff(date_create($row['dan']), date_create())->format('%a');
        if ($diff <= 6) {
            $values[6 - $diff] = (int)$row['broj'];
        }
    }

    echo json_encode([
        "labels" => $labels,
        "values" => $values
    ]);

} catch (Exception $e) {
    echo json_encode([
        "labels" => ["Ned","Pon","Uto","Sri","Čet","Pet","Sub"],
        "values" => [0,0,0,0,0,0,0]
    ]);
}
?>