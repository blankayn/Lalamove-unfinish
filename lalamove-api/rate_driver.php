<?php
require 'cors.php';
require 'db.php';

$data       = json_decode(file_get_contents('php://input'), true);
$deliveryId = $data['delivery_id'] ?? 0;
$custId     = $data['cust_id']     ?? 0;
$drvId      = $data['driver_id']   ?? 0;
$score      = floatval($data['score'] ?? 0);
$comment    = trim($data['comment'] ?? '');

if (!$deliveryId || !$custId || !$drvId || $score < 1 || $score > 5) {
    echo json_encode(['success' => false, 'message' => 'Invalid rating data.']);
    exit;
}

// Check not already rated
$check = $pdo->prepare('SELECT Rting_RateId FROM RATING WHERE Rting_DlvryId = ? AND Rting_CustId = ?');
$check->execute([$deliveryId, $custId]);
if ($check->fetch()) {
    echo json_encode(['success' => false, 'message' => 'You already rated this delivery.']);
    exit;
}

$stmt = $pdo->prepare('INSERT INTO RATING (Rting_DlvryId, Rting_CustId, Rting_DrvId, Rting_Score, Rting_Comment) VALUES (?,?,?,?,?)');
$stmt->execute([$deliveryId, $custId, $drvId, $score, $comment]);

echo json_encode(['success' => true, 'message' => 'Rating submitted. Thank you!']);
?>
