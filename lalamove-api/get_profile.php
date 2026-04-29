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
    $stmt = $pdo->prepare('SELECT Drv_Id as id, Drv_Fname as name, Drv_Email as email, Drv_Cnum as phone, Drv_Lic as license, Drv_Stat as status FROM DRIVER WHERE Drv_Id = ?');
} else {
    $stmt = $pdo->prepare('SELECT Cust_Id as id, Cust_Fname as name, Cust_Email as email, Cust_Cnum as phone, Cust_Addr as address, Cust_Paym as payment FROM CUSTOMER WHERE Cust_Id = ?');
}

$stmt->execute([$userId]);
$profile = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$profile) {
    echo json_encode(['success' => false, 'message' => 'User not found.']);
    exit;
}

echo json_encode(['success' => true, 'profile' => $profile]);
?>
