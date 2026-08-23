-- Supplier purchase and repair workflows are no longer part of the ERP.
-- Existing inventory is deliberately retained; only obsolete module data and
-- its matching historical cashbook entries are removed.
DELETE FROM `CashbookEntry`
WHERE `description` LIKE 'Supplier purchase%' OR `description` LIKE 'Repair advance%';

DELETE FROM `StockMovement`
WHERE `type` IN ('REPAIR_OUT', 'REPAIR_IN');

UPDATE `Product`
SET `status` = 'AVAILABLE'
WHERE `status` = 'IN_REPAIR';

DROP TABLE IF EXISTS `PurchaseItem`;
DROP TABLE IF EXISTS `Purchase`;
DROP TABLE IF EXISTS `Supplier`;
DROP TABLE IF EXISTS `Repair`;

ALTER TABLE `Product`
  MODIFY COLUMN `status` ENUM('AVAILABLE', 'SOLD_OUT', 'INACTIVE') NOT NULL DEFAULT 'AVAILABLE';

ALTER TABLE `StockMovement`
  MODIFY COLUMN `type` ENUM('OPENING', 'PURCHASE', 'SALE', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT') NOT NULL;

CREATE TABLE `DocumentSequence` (
  `key` VARCHAR(32) NOT NULL,
  `lastNumber` INTEGER NOT NULL DEFAULT 0,
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
