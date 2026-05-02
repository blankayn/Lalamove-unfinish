<?php
require 'cors.php';
require 'db.php';

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);
$role = $data['role'] ?? 'customer';
$email = trim($data['email'] ?? '');
$newPassword = $data['newPassword'] ?? '';

if (!$email || !$newPassword) {
    echo json_encode(['success' => false, 'message' => 'Email and new password are required.']);
    exit;
}

// Use password_hash for storing hashed passwords (simple demo)
$hashed = password_hash($newPassword, PASSWORD_DEFAULT);

if ($role === 'driver') {
    // Update driver password
    $stmt = $pdo->prepare('UPDATE DRIVER SET Drv_Password = ? WHERE Drv_Email = ?');
    $stmt->execute([$hashed, $email]);
    $updated = $stmt->rowCount();
} else {
    // Update customer password
    $stmt = $pdo->prepare('UPDATE CUSTOMER SET Cust_Password = ? WHERE Cust_Email = ?');
    $stmt->execute([$hashed, $email]);
    $updated = $stmt->rowCount();
}

if ($updated) {
    echo json_encode(['success' => true, 'message' => 'Password has been reset successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'No account found with that email or password unchanged.']);
}
?>
