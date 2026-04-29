<?php
require 'cors.php';
require 'db.php';

$data     = json_decode(file_get_contents('php://input'), true);
$role     = $data['role']     ?? 'customer';
$email    = trim($data['email']    ?? '');
$password = $data['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit;
}

if ($role === 'driver') {
    $stmt = $pdo->prepare('SELECT Drv_Id, Drv_Fname, Drv_Email, Drv_Cnum, Drv_Stat, Drv_Pass FROM DRIVER WHERE Drv_Email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$user || !password_verify($password, $user['Drv_Pass'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
        exit;
    }
    echo json_encode([
        'success' => true,
        'role'    => 'driver',
        'user'    => [
            'id'    => $user['Drv_Id'],
            'name'  => $user['Drv_Fname'],
            'email' => $user['Drv_Email'],
            'phone' => $user['Drv_Cnum'],
            'status'=> $user['Drv_Stat'],
        ]
    ]);
} else {
    $stmt = $pdo->prepare('SELECT Cust_Id, Cust_Fname, Cust_Email, Cust_Cnum, Cust_Addr, Cust_Paym, Cust_Pass FROM CUSTOMER WHERE Cust_Email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$user || !password_verify($password, $user['Cust_Pass'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
        exit;
    }
    echo json_encode([
        'success' => true,
        'role'    => 'customer',
        'user'    => [
            'id'      => $user['Cust_Id'],
            'name'    => $user['Cust_Fname'],
            'email'   => $user['Cust_Email'],
            'phone'   => $user['Cust_Cnum'],
            'address' => $user['Cust_Addr'],
            'payment' => $user['Cust_Paym'],
        ]
    ]);
}
?>
