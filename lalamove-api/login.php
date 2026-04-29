<?php
require 'cors.php';
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$email    = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, email, phone, country, password FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    exit;
}

// Return user info (never return the password)
echo json_encode([
    'success' => true,
    'message' => 'Login successful.',
    'user' => [
        'id'      => $user['id'],
        'email'   => $user['email'],
        'phone'   => $user['phone'],
        'country' => $user['country'],
    ]
]);
?>
