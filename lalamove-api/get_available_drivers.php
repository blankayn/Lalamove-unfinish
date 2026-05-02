<?php
require 'cors.php';
require 'db.php';

$data   = json_decode(file_get_contents('php://input'), true);
$search = $data['search'] ?? '';
$filters = $data['filters'] ?? [];

// Build query
$query = "
    SELECT d.*, 
           CASE 
               WHEN d.Drv_Stat = 'Available' THEN 'Available'
               ELSE 'Busy'
           END as status
    FROM DRIVER d
    WHERE 1=1
";

$params = [];
$types = "";

// Add search filter
if (!empty($search)) {
    $query .= " AND (d.Drv_Fname LIKE ? OR d.Drv_Email LIKE ?)";
    $searchTerm = "%{$search}%";
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $types .= "ss";
}

// Add availability filter
if (!empty($filters['available_only']) && $filters['available_only'] === true) {
    $query .= " AND d.Drv_Stat = 'Available'";
}

// Add vehicle type filter (if we had vehicle info in driver table)
// For now, we'll skip this as the driver table doesn't have vehicle info
// In a real implementation, you might have a separate vehicle table or add vehicle info to driver

// Add minimum rating filter
if (!empty($filters['min_rating']) && is_numeric($filters['min_rating'])) {
    // Since we don't have rating in driver table yet, we'll skip this for now
    // In a real implementation, you'd join with a ratings table
}

// Order by name
$query .= " ORDER BY d.Drv_Fname";

$stmt = $pdo->prepare($query);

// Bind parameters
if (!empty($params)) {
    $stmt->execute($params);
} else {
    $stmt->execute();
}

$drivers = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Format response
$formattedDrivers = array_map(function($driver) {
    // Determine vehicle emoji based on some logic or random for demo
    // In real implementation, this would come from driver/vehicle data
    $vehicleTypes = [
        ['label' => 'Motorcycle', 'emoji' => '🛵'],
        ['label' => '200 kg Sedan', 'emoji' => '🚗'],
        ['label' => '300 kg Small Crossover SUV', 'emoji' => '🚙'],
        ['label' => '600 kg 7-seater SUV/Minivan', 'emoji' => '🚐'],
        ['label' => '1000 kg Truck', 'emoji' => '🚚']
    ];
    
    // Assign vehicle based on driver ID for consistency
    $vehicleIndex = $driver['Drv_Id'] % count($vehicleTypes);
    $vehicle = $vehicleTypes[$vehicleIndex];
    
    // Calculate mock rating and stats (in real implementation, these would come from database)
    $rating = 4.0 + ($driver['Drv_Id'] % 20) / 10; // 4.0 to 5.9
    $totalDeliveries = 50 + ($driver['Drv_Id'] % 150); // 50-200
    $completionRate = 80 + ($driver['Drv_Id'] % 20); // 80-99
    
    return [
        'id' => $driver['Drv_Id'],
        'name' => $driver['Drv_Fname'],
        'status' => $driver['status'],
        'vehicle_type' => $vehicle['label'],
        'vehicle_emoji' => $vehicle['emoji'],
        'avg_rating' => round($rating, 1),
        'total_deliveries' => $totalDeliveries,
        'completion_rate' => $completionRate,
        'is_favorite' => false, // Would check against customer's favorites in real implementation
        'is_blocked' => false   // Would check against customer's blocked list
    ];
}, $drivers);

echo json_encode([
    'success' => true,
    'drivers' => $formattedDrivers
]);
?>