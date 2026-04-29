<?php
require 'cors.php';
require 'db.php';

$data   = json_decode(file_get_contents('php://input'), true);
$role   = $data['role']    ?? 'customer';
$userId = $data['user_id'] ?? 0;
$name   = trim($data['name']  ?? '');
$phone  = trim($data['phone'] ?? '');

if (!$userId || !$name || !$phone) {
    echo json_encode(['success' => false, 'message' => 'Required fields missing.']);
    exit;
}

if ($role === 'driver') {
    $stmt = $pdo->prepare('UPDATE DRIVER SET Drv_Fname = ?, Drv_Cnum = ? WHERE Drv_Id = ?');
    $stmt->execute([$name, $phone, $userId]);
} else {
    $address = trim($data['address'] ?? '');
    $payment = $data['payment'] ?? 'Cash';
    $stmt = $pdo->prepare('UPDATE CUSTOMER SET Cust_Fname = ?, Cust_Cnum = ?, Cust_Addr = ?, Cust_Paym = ? WHERE Cust_Id = ?');
    $stmt->execute([$name, $phone, $address, $payment, $userId]);
}

echo json_encode(['success' => true, 'message' => 'Profile updated successfully.']);
?>
