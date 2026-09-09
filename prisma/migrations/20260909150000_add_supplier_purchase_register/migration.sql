CREATE TABLE `Supplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `gstin` VARCHAR(20) NULL,
    `panNumber` VARCHAR(20) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `Supplier_phone_key`(`phone`),
    INDEX `Supplier_name_idx`(`name`),
    INDEX `Supplier_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SupplierPurchase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchaseNumber` VARCHAR(50) NOT NULL,
    `supplierId` INTEGER NOT NULL,
    `productId` INTEGER NULL,
    `purchaseDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `metal` ENUM('GOLD', 'SILVER', 'PLATINUM', 'DIAMOND', 'OTHER') NOT NULL DEFAULT 'GOLD',
    `purity` VARCHAR(50) NULL,
    `itemName` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `grossWeight` DECIMAL(12,3) NOT NULL DEFAULT 0,
    `stoneWeight` DECIMAL(12,3) NOT NULL DEFAULT 0,
    `netWeight` DECIMAL(12,3) NOT NULL DEFAULT 0,
    `ratePerGram` DECIMAL(12,2) NOT NULL DEFAULT 0,
    `totalAmount` DECIMAL(12,2) NOT NULL DEFAULT 0,
    `paid` DECIMAL(12,2) NOT NULL DEFAULT 0,
    `paymentMethod` ENUM('CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'CREDIT', 'MIXED') NOT NULL DEFAULT 'CASH',
    `reference` VARCHAR(100) NULL,
    `notes` TEXT NULL,
    `cancelledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `SupplierPurchase_purchaseNumber_key`(`purchaseNumber`),
    UNIQUE INDEX `SupplierPurchase_productId_key`(`productId`),
    INDEX `SupplierPurchase_purchaseDate_idx`(`purchaseDate`),
    INDEX `SupplierPurchase_cancelledAt_purchaseDate_idx`(`cancelledAt`, `purchaseDate`),
    INDEX `SupplierPurchase_supplierId_purchaseDate_idx`(`supplierId`, `purchaseDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `CashbookEntry` ADD COLUMN `supplierPurchaseId` INTEGER NULL;
CREATE INDEX `CashbookEntry_supplierPurchaseId_idx` ON `CashbookEntry`(`supplierPurchaseId`);
ALTER TABLE `SupplierPurchase` ADD CONSTRAINT `SupplierPurchase_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `SupplierPurchase` ADD CONSTRAINT `SupplierPurchase_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `CashbookEntry` ADD CONSTRAINT `CashbookEntry_supplierPurchaseId_fkey` FOREIGN KEY (`supplierPurchaseId`) REFERENCES `SupplierPurchase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
