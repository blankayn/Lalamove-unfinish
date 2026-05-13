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

function fullName(string $firstName, ?string $lastName): string {
    return trim($firstName . ' ' . ($lastName ?? ''));
}

function passwordColumn(PDO $pdo, string $table, string $preferred, string $legacy): string {
    if (hasColumn($pdo, $table, $preferred)) {
        return $preferred;
    }

    if (hasColumn($pdo, $table, $legacy)) {
        return $legacy;
    }

    return $preferred;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request body.']);
    exit;
}

$role = $data['role'] ?? 'customer';
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!in_array($role, ['customer', 'driver'], true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid role selected.']);
    exit;
}

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Enter a valid email address.']);
    exit;
}

if ($role === 'driver') {
    $hasLastName = hasColumn($pdo, 'DRIVER', 'Drv_Lname');
    $passColumn = passwordColumn($pdo, 'DRIVER', 'Drv_Pass', 'Drv_Password');
    $nameColumns = $hasLastName ? 'd.Drv_Fname, d.Drv_Lname,' : 'd.Drv_Fname,';

    $stmt = $pdo->prepare("
        SELECT d.Drv_Id, {$nameColumns} d.Drv_Email, d.Drv_Cnum, d.Drv_Stat, d.{$passColumn} AS DriverPassword, v.Veh_Type
        FROM DRIVER d
        LEFT JOIN VEHICLE v ON v.Veh_DrvId = d.Drv_Id
        WHERE d.Drv_Email = ?
        ORDER BY d.Drv_Id DESC, v.Veh_Id DESC
        LIMIT 1
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['DriverPassword'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
        exit;
    }

    $firstName = $user['Drv_Fname'] ?? '';
    $lastName = $hasLastName ? ($user['Drv_Lname'] ?? '') : '';

    echo json_encode([
        'success' => true,
        'role' => 'driver',
        'user' => [
            'id' => $user['Drv_Id'],
            'name' => $hasLastName ? fullName($firstName, $lastName) : $firstName,
            'fname' => $hasLastName ? $firstName : $firstName,
            'lname' => $hasLastName ? $lastName : '',
            'email' => $user['Drv_Email'],
            'phone' => $user['Drv_Cnum'],
            'status' => $user['Drv_Stat'],
            'vehicle_type' => $user['Veh_Type'] ?: 'Vehicle not set',
        ]
    ]);
    exit;
}

$hasLastName = hasColumn($pdo, 'CUSTOMER', 'Cust_Lname');
$passColumn = passwordColumn($pdo, 'CUSTOMER', 'Cust_Pass', 'Cust_Password');
$nameColumns = $hasLastName ? 'Cust_Fname, Cust_Lname,' : 'Cust_Fname,';

$stmt = $pdo->prepare("SELECT Cust_Id, {$nameColumns} Cust_Email, Cust_Cnum, Cust_Addr, Cust_Paym, {$passColumn} AS CustomerPassword FROM CUSTOMER WHERE Cust_Email = ? ORDER BY Cust_Id DESC LIMIT 1");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['CustomerPassword'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    exit;
}

$firstName = $user['Cust_Fname'] ?? '';
$lastName = $hasLastName ? ($user['Cust_Lname'] ?? '') : '';

echo json_encode([
    'success' => true,
    'role' => 'customer',
    'user' => [
        'id' => $user['Cust_Id'],
        'name' => $hasLastName ? fullName($firstName, $lastName) : $firstName,
        'fname' => $hasLastName ? $firstName : $firstName,
        'lname' => $hasLastName ? $lastName : '',
        'email' => $user['Cust_Email'],
        'phone' => $user['Cust_Cnum'],
        'address' => $user['Cust_Addr'],
        'payment' => $user['Cust_Paym'],
    ]
]);
?>
