<?php
require 'cors.php';
require 'db.php';

$data  = json_decode(file_get_contents('php://input'), true);
$drvId = intval($data['driver_id'] ?? 0);

if (!$drvId) {
    echo json_encode(['success' => false, 'message' => 'Driver ID required.']);
    exit;
}

// Get driver info
$stmt = $pdo->prepare('SELECT * FROM DRIVER WHERE Drv_Id = ?');
$stmt->execute([$drvId]);
$driver = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$driver) {
    echo json_encode(['success' => false, 'message' => 'Driver not found.']);
    exit;
}

// Get ratings/comments for this driver
$rStmt = $pdo->prepare('
    SELECT r.Rting_Score, r.Rting_Comment, r.Rting_Date,
           c.Cust_Fname AS customer_name
    FROM RATING r
    LEFT JOIN CUSTOMER c ON r.Rting_CustId = c.Cust_Id
    WHERE r.Rting_DrvId = ?
    ORDER BY r.Rting_Date DESC
    LIMIT 20
');
$rStmt->execute([$drvId]);
$ratings = $rStmt->fetchAll(PDO::FETCH_ASSOC);

// Compute avg rating
$avg = count($ratings) > 0
    ? round(array_sum(array_column($ratings, 'Rting_Score')) / count($ratings), 1)
    : 0;

// Total completed deliveries
$dStmt = $pdo->prepare("SELECT COUNT(*) FROM DELIVERY WHERE Dlvry_DrvId = ? AND Dlvry_Stat = 'Completed'");
$dStmt->execute([$drvId]);
$totalDeliveries = $dStmt->fetchColumn();

echo json_encode([
    'success' => true,
    'driver'  => [
        'id'               => $driver['Drv_Id'],
        'name'             => $driver['Drv_Fname'],
        'email'            => $driver['Drv_Email'],
        'phone'            => $driver['Drv_Phone'] ?? 'N/A',
        'status'           => $driver['Drv_Stat'] ?? 'Available',
        'avg_rating'       => $avg,
        'total_deliveries' => (int)$totalDeliveries,
    ],
    'reviews' => array_map(fn($r) => [
        'customer'  => $r['customer_name'] ?? 'Anonymous',
        'score'     => (int)$r['Rting_Score'],
        'comment'   => $r['Rting_Comment'],
        'date'      => $r['Rting_Date'],
    ], $ratings),
]);
?>
