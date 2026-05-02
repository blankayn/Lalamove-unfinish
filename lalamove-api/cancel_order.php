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

// Only allow cancelling Pending orders owned by this customer
$stmt = $pdo->prepare("UPDATE DELIVERY SET Dlvry_Stat = 'Cancelled' WHERE Dlvry_Id = ? AND Dlvry_CustId = ? AND Dlvry_Stat = 'Pending'");
$stmt->execute([$deliveryId, $custId]);

if ($stmt->rowCount() > 0) {
    echo json_encode(['success' => true, 'message' => 'Order cancelled.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Cannot cancel this order.']);
}
?>
