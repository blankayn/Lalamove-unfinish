<?php
require 'cors.php';
require 'db.php';
require 'vehicle_utils.php';

$data = json_decode(file_get_contents('php://input'), true);
$search = $data['search'] ?? '';
$filters = $data['filters'] ?? [];

$query = "
    SELECT d.*,
           COALESCE(v.Veh_Type, 'Vehicle not set') AS vehicle_name,
           CASE
               WHEN d.Drv_Stat = 'Available' THEN 'Available'
               ELSE 'Busy'
           END AS status
    FROM DRIVER d
    LEFT JOIN VEHICLE v ON v.Veh_DrvId = d.Drv_Id
    WHERE 1=1
";

$params = [];

if (!empty($search)) {
    $query .= " AND (d.Drv_Fname LIKE ? OR d.Drv_Email LIKE ?)";
    $searchTerm = "%{$search}%";
    $params[] = $searchTerm;
    $params[] = $searchTerm;
}

if (!empty($filters['available_only']) && $filters['available_only'] === true) {
    $query .= " AND d.Drv_Stat = 'Available'";
}

if (!empty($filters['vehicle_type'])) {
    $query .= " AND COALESCE(v.Veh_Type, 'Vehicle not set') = ?";
    $params[] = $filters['vehicle_type'];
}

if (!empty($filters['min_rating']) && is_numeric($filters['min_rating'])) {
    // Ratings are still derived for now. Keep this hook for a future ratings join.
}

$query .= " ORDER BY d.Drv_Fname";

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$drivers = $stmt->fetchAll(PDO::FETCH_ASSOC);

$formattedDrivers = array_map(function ($driver) {
    $vehicleType = trim($driver['vehicle_name'] ?? '') ?: 'Vehicle not set';
    $rating = 4.0 + ($driver['Drv_Id'] % 20) / 10;
    $totalDeliveries = 50 + ($driver['Drv_Id'] % 150);
    $completionRate = 80 + ($driver['Drv_Id'] % 20);

    return [
        'id' => $driver['Drv_Id'],
        'name' => $driver['Drv_Fname'],
        'status' => $driver['status'],
        'vehicle_type' => $vehicleType,
        'vehicle_emoji' => vehicleEmojiForType($vehicleType),
        'avg_rating' => round($rating, 1),
        'total_deliveries' => $totalDeliveries,
        'completion_rate' => $completionRate,
        'is_favorite' => false,
        'is_blocked' => false,
    ];
}, $drivers);

echo json_encode([
    'success' => true,
    'drivers' => $formattedDrivers,
]);

?>
