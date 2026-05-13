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

try {
    $pdo->beginTransaction();

    if ($status === 'Ongoing') {
        // Fetch driver's vehicle rules and current active order count
        $driverStmt = $pdo->prepare("
            SELECT COALESCE(v.Veh_Type, 'Vehicle not set') AS vehicle_type
            FROM DRIVER d
            LEFT JOIN VEHICLE v ON v.Veh_DrvId = d.Drv_Id
            WHERE d.Drv_Id = ?
            ORDER BY v.Veh_Id DESC
            LIMIT 1
        ");
        $driverStmt->execute([$driverId]);
        $driver = $driverStmt->fetch(PDO::FETCH_ASSOC);

        if (!$driver) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => 'Driver not found.']);
            exit;
        }

        $activeStmt = $pdo->prepare("
            SELECT COUNT(*) FROM DELIVERY
            WHERE Dlvry_DrvId = ? AND Dlvry_Stat = 'Ongoing'
        ");
        $activeStmt->execute([$driverId]);
        $activeCount = (int) $activeStmt->fetchColumn();
        $vehicleType = strtolower(trim($driver['vehicle_type'] ?? ''));
        $maxActiveOrders = $vehicleType === 'motorcycle' ? 1 : 999;

        if ($activeCount >= $maxActiveOrders) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => 'Your vehicle is already at its active order limit. Complete a delivery first.']);
            exit;
        }

        // Assign driver and mark delivery as Ongoing
        $stmt = $pdo->prepare('UPDATE DELIVERY SET Dlvry_Stat = ?, Dlvry_DrvId = ? WHERE Dlvry_Id = ? AND Dlvry_Stat = "Pending"');
        $stmt->execute([$status, $driverId, $deliveryId]);

        if ($stmt->rowCount() === 0) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => 'Order no longer available.']);
            exit;
        }

        // Mark driver as Busy
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

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Status updated.']);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to update status. Please try again.']);
}
?>
