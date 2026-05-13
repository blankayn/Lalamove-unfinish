INSERT INTO VEHICLE (Veh_DrvId, Veh_Type, Veh_Plate, Veh_Cap)
SELECT
    d.Drv_Id,
    d.Drv_VehicleType,
    '',
    CASE d.Drv_VehicleType
        WHEN 'Motorcycle' THEN 20
        WHEN '200 kg Sedan' THEN 200
        WHEN '300 kg Small Crossover SUV' THEN 300
        WHEN '600 kg 7-seater SUV/Minivan' THEN 600
        WHEN '1000 kg Truck' THEN 1000
        ELSE 0
    END
FROM DRIVER d
LEFT JOIN VEHICLE v ON v.Veh_DrvId = d.Drv_Id
WHERE v.Veh_Id IS NULL
  AND d.Drv_VehicleType IS NOT NULL
  AND TRIM(d.Drv_VehicleType) <> '';
