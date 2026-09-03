-- Add rate-driven inventory and billing fields.
ALTER TABLE `Product`
  ADD COLUMN `barcode` VARCHAR(191) NULL,
  ADD COLUMN `makingChargeType` ENUM('FIXED', 'PER_GRAM', 'PERCENTAGE') NOT NULL DEFAULT 'PER_GRAM',
  ADD COLUMN `makingChargeValue` DECIMAL(12, 2) NOT NULL DEFAULT 0;

ALTER TABLE `SaleItem`
  ADD COLUMN `makingChargeType` ENUM('FIXED', 'PER_GRAM', 'PERCENTAGE') NOT NULL DEFAULT 'PER_GRAM',
  ADD COLUMN `makingChargeValue` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN `metalAmount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN `metalRate` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN `taxableAmount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN `weight` DECIMAL(12, 3) NOT NULL DEFAULT 0;

CREATE TABLE `DailyRate` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `rateDate` VARCHAR(10) NOT NULL,
  `gold22k` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  `gold24k` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  `silver` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  `note` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `DailyRate_rateDate_key`(`rateDate`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `BarcodeSequence` (
  `prefix` VARCHAR(12) NOT NULL,
  `lastNumber` INTEGER NOT NULL DEFAULT 0,
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`prefix`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CustomerLedger` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `customerId` INTEGER NOT NULL,
  `saleId` INTEGER NULL,
  `type` ENUM('SALE_CREDIT', 'PAYMENT_RECEIVED', 'ADJUSTMENT') NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `paymentMethod` ENUM('CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'CREDIT', 'MIXED') NULL,
  `reference` VARCHAR(191) NULL,
  `note` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `CustomerLedger_customerId_createdAt_idx`(`customerId`, `createdAt`),
  INDEX `CustomerLedger_saleId_idx`(`saleId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE UNIQUE INDEX `Product_barcode_key` ON `Product`(`barcode`);

ALTER TABLE `CustomerLedger`
  ADD CONSTRAINT `CustomerLedger_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `CustomerLedger_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `Sale`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
