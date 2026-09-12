-- Link sale stock movements to their source invoice. The note-based fallback
-- remains in application code for databases that predate this migration.
ALTER TABLE `StockMovement` ADD COLUMN `saleId` INTEGER NULL;
CREATE INDEX `StockMovement_saleId_idx` ON `StockMovement`(`saleId`);
UPDATE `StockMovement` AS sm
JOIN `Sale` AS s ON sm.type = 'SALE' AND sm.note = CONCAT('Sold via ', s.invoiceNumber)
SET sm.saleId = s.id
WHERE sm.saleId IS NULL;
ALTER TABLE `StockMovement`
  ADD CONSTRAINT `StockMovement_saleId_fkey`
  FOREIGN KEY (`saleId`) REFERENCES `Sale`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `SchemePlan` ADD COLUMN `deletionRequestedAt` DATETIME(3) NULL;
