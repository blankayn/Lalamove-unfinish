ALTER TABLE DRIVER
ADD COLUMN Drv_VehicleType VARCHAR(100) NOT NULL DEFAULT 'Motorcycle' AFTER Drv_Lic;

UPDATE DRIVER
SET Drv_VehicleType = 'Motorcycle'
WHERE Drv_VehicleType IS NULL OR TRIM(Drv_VehicleType) = '';
