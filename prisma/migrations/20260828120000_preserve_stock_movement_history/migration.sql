ALTER TABLE `StockMovement` DROP FOREIGN KEY `StockMovement_productId_fkey`;

ALTER TABLE `StockMovement`
  ADD COLUMN `productBarcode` VARCHAR(191) NULL,
  ADD COLUMN `productSku` VARCHAR(191) NOT NULL DEFAULT '',
  ADD COLUMN `productName` VARCHAR(191) NOT NULL DEFAULT '',
  ADD COLUMN `productMetal` ENUM('GOLD', 'SILVER', 'PLATINUM', 'DIAMOND', 'OTHER') NULL,
  ADD COLUMN `productPurity` VARCHAR(191) NULL,
  ADD COLUMN `netWeight` DECIMAL(12, 3) NOT NULL DEFAULT 0;

UPDATE `StockMovement` AS `sm`
INNER JOIN `Product` AS `p` ON `p`.`id` = `sm`.`productId`
SET
  `sm`.`productBarcode` = `p`.`barcode`,
  `sm`.`productSku` = `p`.`sku`,
  `sm`.`productName` = `p`.`name`,
  `sm`.`productMetal` = `p`.`metal`,
  `sm`.`productPurity` = `p`.`purity`,
  `sm`.`netWeight` = `p`.`netWeight`;

ALTER TABLE `StockMovement`
  MODIFY COLUMN `productId` INTEGER NULL;

ALTER TABLE `StockMovement`
  ADD CONSTRAINT `StockMovement_productId_fkey`
  FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
