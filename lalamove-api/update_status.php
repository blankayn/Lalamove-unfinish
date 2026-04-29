<?php
require 'cors.php';
require 'db.php';

$data       = json_decode(file_get_contents('php://input'), true);
$deliveryId = $data['delivery_id'] ?? 0;
$driverId   = $data['driver_id']   ?? 0;
$status     = $data['status']      ?? '';

$allowed = ['Ongoing', 'Completed', 'Cancelled'];
if (!$deliveryId || !$driverId || !in_array($status, $allowed)) {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

// If accepting (Ongoing), assign driver
if ($status === 'Ongoing') {
    $stmt = $pdo->prepare('UPDATE DELIVERY SET Dlvry_Stat = ?, Dlvry_DrvId = ? WHERE Dlvry_Id = ? AND Dlvry_Stat = "Pending"');
    $stmt->execute([$status, $driverId, $deliveryId]);
    // Update driver status to Busy
    $pdo->prepare('UPDATE DRIVER SET Drv_Stat = "Busy" WHERE Drv_Id = ?')->execute([$driverId]);
} else {
    $stmt = $pdo->prepare('UPDATE DELIVERY SET Dlvry_Stat = ? WHERE Dlvry_Id = ? AND Dlvry_DrvId = ?');
    $stmt->execute([$status, $deliveryId, $driverId]);
    if ($status === 'Completed') {
        // Mark payment as Paid
        $pdo->prepare('UPDATE PAYMENT SET Pay_Stat = "Paid", Pay_Date = NOW() WHERE Pay_DlvryId = ?')->execute([$deliveryId]);
        // Set driver back to Available
        $pdo->prepare('UPDATE DRIVER SET Drv_Stat = "Available" WHERE Drv_Id = ?')->execute([$driverId]);
    }
}

echo json_encode(['success' => true, 'message' => 'Status updated.']);
?>
