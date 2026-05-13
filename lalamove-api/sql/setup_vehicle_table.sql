CREATE TABLE IF NOT EXISTS VEHICLE (
    Veh_Id INT AUTO_INCREMENT PRIMARY KEY,
    Veh_Name VARCHAR(100) NOT NULL UNIQUE,
    Veh_CapacityKg INT NOT NULL,
    Veh_BaseFee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    Veh_PerKmFee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    Veh_MaxActiveOrders INT NOT NULL DEFAULT 1,
    Veh_IsActive TINYINT(1) NOT NULL DEFAULT 1,
    Veh_CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO VEHICLE (Veh_Name, Veh_CapacityKg, Veh_BaseFee, Veh_PerKmFee, Veh_MaxActiveOrders)
VALUES
    ('Motorcycle', 20, 50.00, 50.00, 1),
    ('200 kg Sedan', 200, 100.00, 100.00, 2),
    ('300 kg Small Crossover SUV', 300, 150.00, 150.00, 2),
    ('600 kg 7-seater SUV/Minivan', 600, 200.00, 200.00, 3),
    ('1000 kg Truck', 1000, 300.00, 300.00, 4)
ON DUPLICATE KEY UPDATE
    Veh_CapacityKg = VALUES(Veh_CapacityKg),
    Veh_BaseFee = VALUES(Veh_BaseFee),
    Veh_PerKmFee = VALUES(Veh_PerKmFee),
    Veh_MaxActiveOrders = VALUES(Veh_MaxActiveOrders),
    Veh_IsActive = 1;

ALTER TABLE DRIVER
    ADD COLUMN IF NOT EXISTS Drv_VehicleType VARCHAR(100) NOT NULL DEFAULT 'Motorcycle' AFTER Drv_Lic;

UPDATE DRIVER
SET Drv_VehicleType = 'Motorcycle'
WHERE Drv_VehicleType IS NULL OR TRIM(Drv_VehicleType) = '';

ALTER TABLE DRIVER
    ADD COLUMN IF NOT EXISTS Drv_VehId INT NULL AFTER Drv_Lic;

UPDATE DRIVER d
LEFT JOIN VEHICLE v ON v.Veh_Name = d.Drv_VehicleType
SET d.Drv_VehId = v.Veh_Id
WHERE d.Drv_VehId IS NULL;
