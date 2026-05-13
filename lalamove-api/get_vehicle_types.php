<?php
require 'cors.php';
require 'db.php';
require 'vehicle_utils.php';

try {
    $stmt = $pdo->query("
        SELECT MIN(Veh_Id) AS Veh_Id, Veh_Type, MAX(Veh_Cap) AS Veh_Cap
        FROM VEHICLE
        WHERE Veh_Type IS NOT NULL AND TRIM(Veh_Type) <> ''
        GROUP BY Veh_Type
        ORDER BY Veh_Cap, Veh_Type
    ");
    $vehicles = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    $vehicles = [];
}

if (!$vehicles) {
    $fallbackCatalog = defaultVehicleCatalog();
    $vehicles = array_map(fn($vehicle, $index) => [
        'Veh_Id' => $index + 1,
        'Veh_Type' => $vehicle['name'],
        'Veh_Cap' => $vehicle['capacity_kg'],
    ], $fallbackCatalog, array_keys($fallbackCatalog));
}

echo json_encode([
    'success' => true,
    'vehicles' => array_map(fn($vehicle) => [
        'id' => (int) $vehicle['Veh_Id'],
        'name' => $vehicle['Veh_Type'],
        'capacity_kg' => (int) $vehicle['Veh_Cap'],
        'emoji' => vehicleEmojiForType($vehicle['Veh_Type']),
    ], $vehicles),
]);
