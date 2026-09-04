-- CreateTable
CREATE TABLE `SchemePlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `durationMonths` INTEGER NOT NULL,
    `monthlyAmount` DECIMAL(12, 2) NOT NULL,
    `maturityAmount` DECIMAL(12, 2) NOT NULL,
    `description` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SchemeEnrollment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enrollmentNumber` VARCHAR(50) NOT NULL,
    `schemePlanId` INTEGER NOT NULL,
    `customerId` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `status` ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `totalPaid` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `installmentsPaid` INTEGER NOT NULL DEFAULT 0,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SchemeEnrollment_enrollmentNumber_key`(`enrollmentNumber`),
    INDEX `SchemeEnrollment_schemePlanId_idx`(`schemePlanId`),
    INDEX `SchemeEnrollment_customerId_idx`(`customerId`),
    INDEX `SchemeEnrollment_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SchemeInstallment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enrollmentId` INTEGER NOT NULL,
    `installmentNumber` INTEGER NOT NULL,
    `dueDate` VARCHAR(10) NOT NULL,
    `paidAmount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `paymentDate` VARCHAR(10) NULL,
    `paymentMethod` ENUM('CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'CREDIT', 'MIXED') NULL,
    `cashbookEntryId` INTEGER NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SchemeInstallment_enrollmentId_idx`(`enrollmentId`),
    INDEX `SchemeInstallment_cashbookEntryId_idx`(`cashbookEntryId`),
    INDEX `SchemeInstallment_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SchemeEnrollment` ADD CONSTRAINT `SchemeEnrollment_schemePlanId_fkey` FOREIGN KEY (`schemePlanId`) REFERENCES `SchemePlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchemeEnrollment` ADD CONSTRAINT `SchemeEnrollment_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchemeInstallment` ADD CONSTRAINT `SchemeInstallment_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `SchemeEnrollment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchemeInstallment` ADD CONSTRAINT `SchemeInstallment_cashbookEntryId_fkey` FOREIGN KEY (`cashbookEntryId`) REFERENCES `CashbookEntry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
