<?php

function vehicleEmojiForType($vehicleType) {
    return match (trim((string) $vehicleType)) {
        'Motorcycle' => '🛵',
        '200 kg Sedan' => '🚗',
        '300 kg Small Crossover SUV' => '🚙',
        '600 kg 7-seater SUV/Minivan' => '🚐',
        '1000 kg Truck' => '🚚',
        default => '🚘',
    };
}

function defaultVehicleCatalog() {
    return [
        [
            'name' => 'Motorcycle',
            'capacity_kg' => 20,
            'base_fee' => 50.00,
            'per_km_fee' => 50.00,
            'max_active_orders' => 1,
        ],
        [
            'name' => '200 kg Sedan',
            'capacity_kg' => 200,
            'base_fee' => 100.00,
            'per_km_fee' => 100.00,
            'max_active_orders' => 2,
        ],
        [
            'name' => '300 kg Small Crossover SUV',
            'capacity_kg' => 300,
            'base_fee' => 150.00,
            'per_km_fee' => 150.00,
            'max_active_orders' => 2,
        ],
        [
            'name' => '600 kg 7-seater SUV/Minivan',
            'capacity_kg' => 600,
            'base_fee' => 200.00,
            'per_km_fee' => 200.00,
            'max_active_orders' => 3,
        ],
        [
            'name' => '1000 kg Truck',
            'capacity_kg' => 1000,
            'base_fee' => 300.00,
            'per_km_fee' => 300.00,
            'max_active_orders' => 4,
        ],
    ];
}
