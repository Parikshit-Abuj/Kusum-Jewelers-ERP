-- CreateTable
CREATE TABLE `CashbookEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entryDate` VARCHAR(10) NOT NULL,
    `type` ENUM('IN', 'OUT') NOT NULL,
    `paymentMethod` ENUM('CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'CREDIT', 'MIXED') NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `reference` VARCHAR(100) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CashbookEntry_entryDate_idx`(`entryDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
