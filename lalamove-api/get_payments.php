<?php
require 'cors.php';
require 'db.php';

$data   = json_decode(file_get_contents('php://input'), true);
$custId = $data['cust_id'] ?? 0;

if (!$custId) {
    echo json_encode(['success' => false, 'message' => 'Customer ID required.']);
    exit;
}

$stmt = $pdo->prepare('
    SELECT p.*, d.Dlvry_Pick, d.Dlvry_Drop, d.Dlvry_Stat
    FROM PAYMENT p
    JOIN DELIVERY d ON p.Pay_DlvryId = d.Dlvry_Id
    WHERE d.Dlvry_CustId = ?
    ORDER BY p.Pay_Date DESC
');
$stmt->execute([$custId]);
$payments = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Calculate total balance (sum of paid)
$total = array_sum(array_column(
    array_filter($payments, fn($p) => $p['Pay_Stat'] === 'Paid'),
    'Pay_Amt'
));

echo json_encode(['success' => true, 'payments' => $payments, 'total_spent' => $total]);
?>
