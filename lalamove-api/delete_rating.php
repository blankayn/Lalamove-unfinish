<?php
require 'cors.php';
require 'db.php';

$data       = json_decode(file_get_contents('php://input'), true);
$deliveryId = intval($data['delivery_id'] ?? 0);
$custId     = intval($data['cust_id']     ?? 0);

if (!$deliveryId || !$custId) {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

try {
    $pdo->beginTransaction();

    // Only allow deleting your own rating
    $stmt = $pdo->prepare('
        DELETE FROM RATING
        WHERE Rting_DlvryId = ? AND Rting_CustId = ?
    ');
    $stmt->execute([$deliveryId, $custId]);

    if ($stmt->rowCount() === 0) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'No rating found to delete.']);
        exit;
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Rating deleted.']);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to delete rating. Please try again.']);
}
?>
