-- Seed the permanent counters used by concurrent shop PCs before the first
-- new reservation. Once initialized, runtime reservations use only one
-- atomic INSERT ... ON DUPLICATE KEY UPDATE statement.

INSERT INTO `DocumentSequence` (`key`, `lastNumber`, `updatedAt`)
SELECT
  CONCAT('BATCH-', SUBSTRING(`batchDocNo`, 7, 8)) AS `key`,
  MAX(CAST(SUBSTRING_INDEX(`batchDocNo`, '-', -1) AS UNSIGNED)) AS `lastNumber`,
  CURRENT_TIMESTAMP(3)
FROM `Product`
WHERE `batchDocNo` LIKE 'BATCH-________-%'
GROUP BY CONCAT('BATCH-', SUBSTRING(`batchDocNo`, 7, 8))
ON DUPLICATE KEY UPDATE
  `lastNumber` = GREATEST(`lastNumber`, VALUES(`lastNumber`)),
  `updatedAt` = CURRENT_TIMESTAMP(3);

INSERT INTO `BarcodeSequence` (`prefix`, `lastNumber`, `updatedAt`)
SELECT `prefix`, MAX(`serial`) AS `lastNumber`, CURRENT_TIMESTAMP(3)
FROM (
  SELECT
    CASE
      WHEN `barcode` REGEXP '^G24[[:space:]][0-9]+$' THEN 'G24'
      WHEN `barcode` REGEXP '^G22[[:space:]][0-9]+$' THEN 'G22'
      WHEN `barcode` REGEXP '^S[[:space:]][0-9]+$' THEN 'S'
      WHEN `barcode` REGEXP '^J[[:space:]][0-9]+$' THEN 'J'
      ELSE NULL
    END AS `prefix`,
    CAST(SUBSTRING_INDEX(`barcode`, ' ', -1) AS UNSIGNED) AS `serial`
  FROM (
    SELECT `barcode` FROM `Product`
    UNION ALL SELECT `productBarcode` AS `barcode` FROM `StockMovement`
    UNION ALL SELECT `productBarcode` AS `barcode` FROM `SaleItem`
  ) AS `barcodeHistory`
  WHERE `barcode` IS NOT NULL
) AS `parsedBarcodeHistory`
WHERE `prefix` IS NOT NULL
GROUP BY `prefix`
ON DUPLICATE KEY UPDATE
  `lastNumber` = GREATEST(`lastNumber`, VALUES(`lastNumber`)),
  `updatedAt` = CURRENT_TIMESTAMP(3);
