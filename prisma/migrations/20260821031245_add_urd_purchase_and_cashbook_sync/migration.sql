-- AlterTable
ALTER TABLE `CashbookEntry` ADD COLUMN `customerId` INTEGER NULL,
    ADD COLUMN `syncLedger` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `UrdPurchase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchaseNumber` VARCHAR(191) NOT NULL,
    `customerId` INTEGER NOT NULL,
    `purchaseDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `metal` ENUM('GOLD', 'SILVER', 'PLATINUM', 'DIAMOND', 'OTHER') NOT NULL DEFAULT 'GOLD',
    `purity` VARCHAR(191) NULL,
    `grossWeight` DECIMAL(12, 3) NOT NULL DEFAULT 0,
    `netWeight` DECIMAL(12, 3) NOT NULL DEFAULT 0,
    `ratePerGram` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `totalAmount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `paid` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `paymentMethod` ENUM('CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'CREDIT', 'MIXED') NOT NULL DEFAULT 'CASH',
    `description` TEXT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UrdPurchase_purchaseNumber_key`(`purchaseNumber`),
    INDEX `UrdPurchase_purchaseDate_idx`(`purchaseDate`),
    INDEX `UrdPurchase_customerId_idx`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `CashbookEntry_customerId_idx` ON `CashbookEntry`(`customerId`);

-- AddForeignKey
ALTER TABLE `CashbookEntry` ADD CONSTRAINT `CashbookEntry_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UrdPurchase` ADD CONSTRAINT `UrdPurchase_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
