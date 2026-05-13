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

    // Cancel the delivery — only if it's Pending and owned by this customer
    $stmt = $pdo->prepare("
        UPDATE DELIVERY
        SET Dlvry_Stat = 'Cancelled'
        WHERE Dlvry_Id = ? AND Dlvry_CustId = ? AND Dlvry_Stat = 'Pending'
    ");
    $stmt->execute([$deliveryId, $custId]);

    if ($stmt->rowCount() === 0) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Cannot cancel this order.']);
        exit;
    }

    // Also cancel the linked payment record
    $pdo->prepare("
        UPDATE PAYMENT
        SET Pay_Stat = 'Cancelled'
        WHERE Pay_DlvryId = ? AND Pay_Stat = 'Pending'
    ")->execute([$deliveryId]);

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Order cancelled.']);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to cancel order. Please try again.']);
}
?>
