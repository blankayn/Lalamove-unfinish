<?php
require 'cors.php';
require 'db.php';

$data   = json_decode(file_get_contents('php://input'), true);
$role   = $data['role']    ?? 'customer';
$userId = $data['user_id'] ?? 0;

if (!$userId) {
    echo json_encode(['success' => false, 'message' => 'User ID required.']);
    exit;
}

if ($role === 'driver') {
    // Driver sees orders assigned to them OR all pending orders
    $stmt = $pdo->prepare('
        SELECT d.*, c.Cust_Fname as customer_name, c.Cust_Cnum as customer_phone
        FROM DELIVERY d
        JOIN CUSTOMER c ON d.Dlvry_CustId = c.Cust_Id
        WHERE d.Dlvry_DrvId = ? OR (d.Dlvry_DrvId IS NULL AND d.Dlvry_Stat = "Pending")
        ORDER BY d.Dlvry_Time DESC
    ');
    $stmt->execute([$userId]);
} else {
    // Customer sees their own orders
    $stmt = $pdo->prepare('
        SELECT d.*, drv.Drv_Fname as driver_name, drv.Drv_Cnum as driver_phone
        FROM DELIVERY d
        LEFT JOIN DRIVER drv ON d.Dlvry_DrvId = drv.Drv_Id
        WHERE d.Dlvry_CustId = ?
        ORDER BY d.Dlvry_Time DESC
    ');
    $stmt->execute([$userId]);
}

$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(['success' => true, 'orders' => $orders]);
?>
