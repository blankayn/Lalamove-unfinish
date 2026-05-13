<?php
require 'cors.php';
require 'db.php';

function hasColumn(PDO $pdo, string $table, string $column): bool {
    static $cache = [];
    $key = $table . '.' . $column;

    if (array_key_exists($key, $cache)) {
        return $cache[$key];
    }

    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?'
    );
    $stmt->execute([$table, $column]);

    return $cache[$key] = ((int) $stmt->fetchColumn()) > 0;
}

function updatePasswordColumns(PDO $pdo, string $table, string $idColumn, int $id, string $hashed): void {
    $updates = [];

    foreach (['Drv_Pass', 'Drv_Password', 'Cust_Pass', 'Cust_Password'] as $column) {
        if (hasColumn($pdo, $table, $column)) {
            $updates[] = $column;
        }
    }

    if (!$updates) {
        throw new RuntimeException('No password column found.');
    }

    $setClause = implode(', ', array_map(fn($column) => "{$column} = ?", $updates));
    $params = array_fill(0, count($updates), $hashed);
    $params[] = $id;

    $stmt = $pdo->prepare("UPDATE {$table} SET {$setClause} WHERE {$idColumn} = ?");
    $stmt->execute($params);
}

$data = json_decode(file_get_contents('php://input'), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request body.']);
    exit;
}

$role = $data['role'] ?? 'customer';
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$newPassword = trim($data['new_password'] ?? '');

if (!in_array($role, ['customer', 'driver'], true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid role selected.']);
    exit;
}

if (!$email || !$phone || !$newPassword) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email, phone number, and new password are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Enter a valid email address.']);
    exit;
}

if (!preg_match('/^[0-9+\-\s]{7,15}$/', $phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Enter a valid phone number.']);
    exit;
}

if (strlen($newPassword) < 6) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'New password must be at least 6 characters.']);
    exit;
}

try {
    if ($role === 'driver') {
        $stmt = $pdo->prepare('SELECT Drv_Id FROM DRIVER WHERE Drv_Email = ? AND Drv_Cnum = ?');
        $stmt->execute([$email, $phone]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Email and phone number do not match any account.']);
            exit;
        }

        $hashed = password_hash($newPassword, PASSWORD_BCRYPT);
        updatePasswordColumns($pdo, 'DRIVER', 'Drv_Id', (int) $user['Drv_Id'], $hashed);
    } else {
        $stmt = $pdo->prepare('SELECT Cust_Id FROM CUSTOMER WHERE Cust_Email = ? AND Cust_Cnum = ?');
        $stmt->execute([$email, $phone]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Email and phone number do not match any account.']);
            exit;
        }

        $hashed = password_hash($newPassword, PASSWORD_BCRYPT);
        updatePasswordColumns($pdo, 'CUSTOMER', 'Cust_Id', (int) $user['Cust_Id'], $hashed);
    }

    echo json_encode(['success' => true, 'message' => 'Password updated successfully. You can now log in.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to update password. Please try again.']);
}
?>
