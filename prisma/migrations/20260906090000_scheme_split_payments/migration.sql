-- A scheme installment may be paid through more than one method, for example
-- Cash ₹1,000 plus Bank Transfer ₹4,000.  Each portion has its own cashbook
-- receipt so payment-method registers remain accurate.
CREATE TABLE `SchemeInstallmentPayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `installmentId` INTEGER NOT NULL,
    `cashbookEntryId` INTEGER NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `paymentDate` VARCHAR(10) NOT NULL,
    `paymentMethod` ENUM('CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'CREDIT', 'MIXED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SchemeInstallmentPayment_cashbookEntryId_key`(`cashbookEntryId`),
    INDEX `SchemeInstallmentPayment_installmentId_idx`(`installmentId`),
    INDEX `SchemeInstallmentPayment_paymentDate_idx`(`paymentDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Existing single-method installments remain fully usable after the upgrade.
-- Their original cashbook receipt becomes one payment portion.
INSERT IGNORE INTO `SchemeInstallmentPayment`
  (`installmentId`, `cashbookEntryId`, `amount`, `paymentDate`, `paymentMethod`, `createdAt`)
SELECT
  `id`,
  `cashbookEntryId`,
  `paidAmount`,
  COALESCE(`paymentDate`, DATE_FORMAT(`createdAt`, '%Y-%m-%d')),
  COALESCE(`paymentMethod`, 'CASH'),
  `createdAt`
FROM `SchemeInstallment`
WHERE `cashbookEntryId` IS NOT NULL AND `paidAmount` > 0;

ALTER TABLE `SchemeInstallmentPayment`
  ADD CONSTRAINT `SchemeInstallmentPayment_installmentId_fkey`
  FOREIGN KEY (`installmentId`) REFERENCES `SchemeInstallment`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SchemeInstallmentPayment`
  ADD CONSTRAINT `SchemeInstallmentPayment_cashbookEntryId_fkey`
  FOREIGN KEY (`cashbookEntryId`) REFERENCES `CashbookEntry`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
