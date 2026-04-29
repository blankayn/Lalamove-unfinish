<?php
require 'cors.php';
require 'db.php';

$data     = json_decode(file_get_contents('php://input'), true);
$custId   = $data['cust_id']  ?? 0;
$pickup   = trim($data['pickup']   ?? '');
$dropoff  = trim($data['dropoff']  ?? '');
$item     = trim($data['item']     ?? '');
$dist     = floatval($data['dist'] ?? 0);
$fee      = floatval($data['fee']  ?? 0);
$paymeth  = $data['payment_method'] ?? 'Cash';

if (!$custId || !$pickup || !$dropoff || !$item) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

// Insert delivery
$stmt = $pdo->prepare('INSERT INTO DELIVERY (Dlvry_CustId, Dlvry_Pick, Dlvry_Drop, Dlvry_Item, Dlvry_Dist, Dlvry_Fee, Dlvry_Stat) VALUES (?,?,?,?,?,?,?)');
$stmt->execute([$custId, $pickup, $dropoff, $item, $dist, $fee, 'Pending']);
$deliveryId = $pdo->lastInsertId();

// Insert payment record
$stmt2 = $pdo->prepare('INSERT INTO PAYMENT (Pay_DlvryId, Pay_CustPaymeth, Pay_Amt, Pay_Stat) VALUES (?,?,?,?)');
$stmt2->execute([$deliveryId, $paymeth, $fee, 'Pending']);

echo json_encode(['success' => true, 'message' => 'Order placed successfully.', 'delivery_id' => $deliveryId]);
?>
