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

$data = json_decode(file_get_contents('php://input'), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request body.']);
    exit;
}

$role = $data['role'] ?? 'customer';
$fname = trim($data['fname'] ?? $data['name'] ?? '');
$lname = trim($data['lname'] ?? '');
$name = trim($fname . ' ' . $lname);
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$password = $data['password'] ?? '';
$address = trim($data['address'] ?? '');
$license = trim($data['license'] ?? '');
$plate = strtoupper(trim($data['plate'] ?? ''));
$vehicleType = trim($data['vehicle_type'] ?? '');

if (!in_array($role, ['customer', 'driver'], true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid role selected.']);
    exit;
}

if (!$fname || !$lname || !$email || !$phone || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'First name, last name, email, phone number, and password are required.']);
    exit;
}

if (!preg_match("/^[a-zA-ZÀ-ÿ\s'-]+$/u", $fname)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'First name must contain letters only.']);
    exit;
}

if (!preg_match("/^[a-zA-ZÀ-ÿ\s'-]+$/u", $lname)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Last name must contain letters only.']);
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

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters.']);
    exit;
}

$hashed = password_hash($password, PASSWORD_BCRYPT);

try {
    if ($role === 'driver') {
        if (!$license || !$plate || !$vehicleType) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'License number, plate number, and vehicle type are required for drivers.']);
            exit;
        }

        $check = $pdo->prepare('SELECT Drv_Id FROM DRIVER WHERE Drv_Email = ?');
        $check->execute([$email]);
        if ($check->fetch()) {
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Email already registered.']);
            exit;
        }

        $capacity = match ($vehicleType) {
            'Motorcycle' => 20,
            '200 kg Sedan' => 200,
            '300 kg Small Crossover SUV' => 300,
            '600 kg 7-seater SUV/Minivan' => 600,
            '1000 kg Truck' => 1000,
            default => 0,
        };

        $pdo->beginTransaction();

        if (hasColumn($pdo, 'DRIVER', 'Drv_Lname')) {
            $stmt = $pdo->prepare('INSERT INTO DRIVER (Drv_Fname, Drv_Lname, Drv_Email, Drv_Cnum, Drv_Pass, Drv_Lic, Drv_Stat) VALUES (?,?,?,?,?,?,?)');
            $stmt->execute([$fname, $lname, $email, $phone, $hashed, $license, 'Available']);
        } else {
            $stmt = $pdo->prepare('INSERT INTO DRIVER (Drv_Fname, Drv_Email, Drv_Cnum, Drv_Pass, Drv_Lic, Drv_Stat) VALUES (?,?,?,?,?,?)');
            $stmt->execute([$name, $email, $phone, $hashed, $license, 'Available']);
        }

        $driverId = (int) $pdo->lastInsertId();

        $vehicleStmt = $pdo->prepare('INSERT INTO VEHICLE (Veh_DrvId, Veh_Type, Veh_Plate, Veh_Cap) VALUES (?, ?, ?, ?)');
        $vehicleStmt->execute([$driverId, $vehicleType, $plate, $capacity]);

        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Driver account created.']);
        exit;
    }

    if (!$address) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Address is required.']);
        exit;
    }

    $check = $pdo->prepare('SELECT Cust_Id FROM CUSTOMER WHERE Cust_Email = ?');
    $check->execute([$email]);
    if ($check->fetch()) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Email already registered.']);
        exit;
    }

    if (hasColumn($pdo, 'CUSTOMER', 'Cust_Lname')) {
        $stmt = $pdo->prepare('INSERT INTO CUSTOMER (Cust_Fname, Cust_Lname, Cust_Email, Cust_Cnum, Cust_Addr, Cust_Pass, Cust_Paym) VALUES (?,?,?,?,?,?,?)');
        $stmt->execute([$fname, $lname, $email, $phone, $address, $hashed, 'Cash']);
    } else {
        $stmt = $pdo->prepare('INSERT INTO CUSTOMER (Cust_Fname, Cust_Email, Cust_Cnum, Cust_Addr, Cust_Pass, Cust_Paym) VALUES (?,?,?,?,?,?)');
        $stmt->execute([$name, $email, $phone, $address, $hashed, 'Cash']);
    }

    echo json_encode(['success' => true, 'message' => 'Customer account created.']);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to create account. Please check your database setup and try again.']);
}
?>
