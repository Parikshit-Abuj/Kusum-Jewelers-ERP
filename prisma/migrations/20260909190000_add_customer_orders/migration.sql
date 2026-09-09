CREATE TABLE `CustomerOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderNumber` VARCHAR(50) NOT NULL,
    `customerId` INTEGER NOT NULL,
    `supplierId` INTEGER NULL,
    `orderDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dueDate` DATETIME(3) NULL,
    `itemName` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NULL,
    `metal` ENUM('GOLD', 'SILVER', 'PLATINUM', 'DIAMOND', 'OTHER') NOT NULL DEFAULT 'GOLD',
    `purity` VARCHAR(50) NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `targetGrossWeight` DECIMAL(12,3) NOT NULL DEFAULT 0,
    `targetNetWeight` DECIMAL(12,3) NOT NULL DEFAULT 0,
    `quotedAmount` DECIMAL(12,2) NOT NULL DEFAULT 0,
    `customerAdvance` DECIMAL(12,2) NOT NULL DEFAULT 0,
    `refundedAmount` DECIMAL(12,2) NOT NULL DEFAULT 0,
    `advancePaymentMethod` ENUM('CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'CREDIT', 'MIXED') NULL,
    `status` ENUM('OPEN', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'OPEN',
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `CustomerOrder_orderNumber_key`(`orderNumber`),
    INDEX `CustomerOrder_orderDate_idx`(`orderDate`),
    INDEX `CustomerOrder_status_orderDate_idx`(`status`, `orderDate`),
    INDEX `CustomerOrder_customerId_status_idx`(`customerId`, `status`),
    INDEX `CustomerOrder_supplierId_status_idx`(`supplierId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `CashbookEntry` ADD COLUMN `customerOrderId` INTEGER NULL;
CREATE INDEX `CashbookEntry_customerOrderId_idx` ON `CashbookEntry`(`customerOrderId`);
ALTER TABLE `CustomerOrder` ADD CONSTRAINT `CustomerOrder_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `CustomerOrder` ADD CONSTRAINT `CustomerOrder_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `CashbookEntry` ADD CONSTRAINT `CashbookEntry_customerOrderId_fkey` FOREIGN KEY (`customerOrderId`) REFERENCES `CustomerOrder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
