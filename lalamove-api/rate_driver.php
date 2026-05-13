<?php
require 'cors.php';
require 'db.php';

$data       = json_decode(file_get_contents('php://input'), true);
$deliveryId = intval($data['delivery_id'] ?? 0);
$custId     = intval($data['cust_id']     ?? 0);
$drvId      = intval($data['driver_id']   ?? 0);
$score      = intval($data['score']       ?? 0);
$comment    = trim($data['comment']       ?? '');

if (!$deliveryId || !$custId || !$drvId || $score < 1 || $score > 5) {
    echo json_encode(['success' => false, 'message' => 'Invalid rating data.']);
    exit;
}

try {
    $pdo->beginTransaction();

    // Lock the check and insert inside a transaction to prevent duplicate ratings
    // under simultaneous requests (race condition)
    $check = $pdo->prepare('
        SELECT Rting_RateId FROM RATING
        WHERE Rting_DlvryId = ? AND Rting_CustId = ?
        FOR UPDATE
    ');
    $check->execute([$deliveryId, $custId]);

    if ($check->fetch()) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'You already rated this delivery.']);
        exit;
    }

    // Verify the delivery is Completed and belongs to this customer
    $verify = $pdo->prepare("
        SELECT Dlvry_Id FROM DELIVERY
        WHERE Dlvry_Id = ? AND Dlvry_CustId = ? AND Dlvry_Stat = 'Completed'
    ");
    $verify->execute([$deliveryId, $custId]);

    if (!$verify->fetch()) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Cannot rate this delivery.']);
        exit;
    }

    // Insert the rating
    $pdo->prepare('
        INSERT INTO RATING (Rting_DlvryId, Rting_CustId, Rting_DrvId, Rting_Score, Rting_Comment)
        VALUES (?, ?, ?, ?, ?)
    ')->execute([$deliveryId, $custId, $drvId, $score, $comment]);

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Rating submitted. Thank you!']);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to submit rating. Please try again.']);
}
?>
