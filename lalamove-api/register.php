<?php
require 'cors.php';
require 'db.php';

$data     = json_decode(file_get_contents('php://input'), true);
$role     = $data['role']     ?? 'customer';
$name     = trim($data['name']     ?? '');
$email    = trim($data['email']    ?? '');
$phone    = trim($data['phone']    ?? '');
$password = $data['password'] ?? '';
$address  = trim($data['address']  ?? '');
$license  = trim($data['license']  ?? '');

if (!$name || !$email || !$phone || !$password) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}
if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters.']);
    exit;
}

$hashed = password_hash($password, PASSWORD_BCRYPT);

if ($role === 'driver') {
    if (!$license) {
        echo json_encode(['success' => false, 'message' => 'License number is required for drivers.']);
        exit;
    }
    $check = $pdo->prepare('SELECT Drv_Id FROM DRIVER WHERE Drv_Email = ?');
    $check->execute([$email]);
    if ($check->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email already registered.']);
        exit;
    }
    $stmt = $pdo->prepare('INSERT INTO DRIVER (Drv_Fname, Drv_Email, Drv_Cnum, Drv_Pass, Drv_Lic, Drv_Stat) VALUES (?,?,?,?,?,?)');
    $stmt->execute([$name, $email, $phone, $hashed, $license, 'Available']);
    echo json_encode(['success' => true, 'message' => 'Driver account created.']);
} else {
    if (!$address) {
        echo json_encode(['success' => false, 'message' => 'Address is required.']);
        exit;
    }
    $check = $pdo->prepare('SELECT Cust_Id FROM CUSTOMER WHERE Cust_Email = ?');
    $check->execute([$email]);
    if ($check->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email already registered.']);
        exit;
    }
    $stmt = $pdo->prepare('INSERT INTO CUSTOMER (Cust_Fname, Cust_Email, Cust_Cnum, Cust_Addr, Cust_Pass, Cust_Paym) VALUES (?,?,?,?,?,?)');
    $stmt->execute([$name, $email, $phone, $address, $hashed, 'Cash']);
    echo json_encode(['success' => true, 'message' => 'Customer account created.']);
}
?>
