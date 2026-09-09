-- Customer jewellery pledged as collateral for money lent by the shop.
-- Pledged items deliberately do not enter Product/StockMovement inventory.
CREATE TABLE `PledgeLoan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pledgeNumber` VARCHAR(50) NOT NULL,
    `customerId` INTEGER NOT NULL,
    `pledgeDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dueDate` DATETIME(3) NULL,
    `metal` ENUM('GOLD', 'SILVER', 'PLATINUM', 'DIAMOND', 'OTHER') NOT NULL DEFAULT 'GOLD',
    `itemDescription` VARCHAR(255) NOT NULL,
    `purity` VARCHAR(50) NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `grossWeight` DECIMAL(12,3) NOT NULL DEFAULT 0,
    `stoneWeight` DECIMAL(12,3) NOT NULL DEFAULT 0,
    `netWeight` DECIMAL(12,3) NOT NULL DEFAULT 0,
    `valuationAmount` DECIMAL(12,2) NOT NULL DEFAULT 0,
    `principalAmount` DECIMAL(12,2) NOT NULL,
    `principalRepaid` DECIMAL(12,2) NOT NULL DEFAULT 0,
    `interestReceived` DECIMAL(12,2) NOT NULL DEFAULT 0,
    `monthlyInterestRate` DECIMAL(5,2) NOT NULL DEFAULT 0,
    `status` ENUM('ACTIVE', 'RELEASED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `notes` TEXT NULL,
    `releasedAt` DATETIME(3) NULL,
    `cancelledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `PledgeLoan_pledgeNumber_key`(`pledgeNumber`),
    INDEX `PledgeLoan_pledgeDate_idx`(`pledgeDate`),
    INDEX `PledgeLoan_status_pledgeDate_idx`(`status`, `pledgeDate`),
    INDEX `PledgeLoan_customerId_status_idx`(`customerId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `PledgeLoanPayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pledgeLoanId` INTEGER NOT NULL,
    `cashbookEntryId` INTEGER NOT NULL,
    `paymentDate` VARCHAR(10) NOT NULL,
    `principalAmount` DECIMAL(12,2) NOT NULL DEFAULT 0,
    `interestAmount` DECIMAL(12,2) NOT NULL DEFAULT 0,
    `paymentMethod` ENUM('CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'CREDIT', 'MIXED') NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `PledgeLoanPayment_cashbookEntryId_key`(`cashbookEntryId`),
    INDEX `PledgeLoanPayment_pledgeLoanId_paymentDate_idx`(`pledgeLoanId`, `paymentDate`),
    INDEX `PledgeLoanPayment_paymentDate_idx`(`paymentDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `CashbookEntry` ADD COLUMN `pledgeLoanId` INTEGER NULL;
CREATE INDEX `CashbookEntry_pledgeLoanId_idx` ON `CashbookEntry`(`pledgeLoanId`);

ALTER TABLE `PledgeLoan` ADD CONSTRAINT `PledgeLoan_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `PledgeLoanPayment` ADD CONSTRAINT `PledgeLoanPayment_pledgeLoanId_fkey` FOREIGN KEY (`pledgeLoanId`) REFERENCES `PledgeLoan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `PledgeLoanPayment` ADD CONSTRAINT `PledgeLoanPayment_cashbookEntryId_fkey` FOREIGN KEY (`cashbookEntryId`) REFERENCES `CashbookEntry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `CashbookEntry` ADD CONSTRAINT `CashbookEntry_pledgeLoanId_fkey` FOREIGN KEY (`pledgeLoanId`) REFERENCES `PledgeLoan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
