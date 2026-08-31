-- Preserve every existing barcode and start independent, fixed-width Base-36
-- counters for newly created stock. The visible format is G 00001,
-- S 00001 or J 00001. Legacy 22K/24K/non-padded labels remain unchanged.

INSERT INTO `BarcodeSequence` (`prefix`, `lastNumber`, `updatedAt`)
VALUES
  ('G_B36', 0, CURRENT_TIMESTAMP(3)),
  ('S_B36', 0, CURRENT_TIMESTAMP(3)),
  ('J_B36', 0, CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `lastNumber` = `lastNumber`,
  `updatedAt` = CURRENT_TIMESTAMP(3);

-- If a database already has any padded four-character labels, preserve that
-- progress too. Stock movements and sales are included because billed pieces
-- are deleted from the live Product table.
INSERT INTO `BarcodeSequence` (`prefix`, `lastNumber`, `updatedAt`)
SELECT `seriesKey`, MAX(`serial`) AS `lastNumber`, CURRENT_TIMESTAMP(3)
FROM (
  SELECT
    CASE
      WHEN `barcode` REGEXP '^G[[:space:]][0-9A-Z]{5}$' THEN 'G_B36'
      WHEN `barcode` REGEXP '^S[[:space:]][0-9A-Z]{5}$' THEN 'S_B36'
      WHEN `barcode` REGEXP '^J[[:space:]][0-9A-Z]{5}$' THEN 'J_B36'
      ELSE NULL
    END AS `seriesKey`,
    CAST(CONV(SUBSTRING_INDEX(`barcode`, ' ', -1), 36, 10) AS UNSIGNED) AS `serial`
  FROM (
    SELECT `barcode` FROM `Product`
    UNION ALL SELECT `productBarcode` AS `barcode` FROM `StockMovement`
    UNION ALL SELECT `productBarcode` AS `barcode` FROM `SaleItem`
  ) AS `barcodeHistory`
  WHERE `barcode` IS NOT NULL
) AS `parsedBarcodeHistory`
WHERE `seriesKey` IS NOT NULL
GROUP BY `seriesKey`
ON DUPLICATE KEY UPDATE
  `lastNumber` = GREATEST(`lastNumber`, VALUES(`lastNumber`)),
  `updatedAt` = CURRENT_TIMESTAMP(3);
