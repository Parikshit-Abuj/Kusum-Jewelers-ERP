CREATE TABLE `AppSession` (
  `id` VARCHAR(128) NOT NULL,
  `data` LONGTEXT NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `AppSession_expiresAt_idx` (`expiresAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `Customer_createdAt_idx` ON `Customer`(`createdAt`);
CREATE INDEX `Product_status_quantity_idx` ON `Product`(`status`, `quantity`);
CREATE INDEX `Product_metal_status_quantity_idx` ON `Product`(`metal`, `status`, `quantity`);
CREATE INDEX `Product_createdAt_idx` ON `Product`(`createdAt`);
CREATE INDEX `StockMovement_createdAt_idx` ON `StockMovement`(`createdAt`);
CREATE INDEX `Sale_customerId_balance_saleDate_idx` ON `Sale`(`customerId`, `balance`, `saleDate`);
