-- Preserve the exact amount received by every supported payment method.
ALTER TABLE `Sale`
  ADD COLUMN `cardPaid` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN `bankPaid` DECIMAL(12, 2) NOT NULL DEFAULT 0;

-- Trace cashbook movements back to the records they changed. These links make
-- a delete reversible without relying on display text or a user-entered note.
ALTER TABLE `CashbookEntry`
  ADD COLUMN `saleId` INTEGER NULL,
  ADD COLUMN `urdPurchaseId` INTEGER NULL;

ALTER TABLE `CustomerLedger`
  ADD COLUMN `cashbookEntryId` INTEGER NULL;

CREATE INDEX `CashbookEntry_saleId_idx` ON `CashbookEntry`(`saleId`);
CREATE INDEX `CashbookEntry_urdPurchaseId_idx` ON `CashbookEntry`(`urdPurchaseId`);
CREATE INDEX `CustomerLedger_cashbookEntryId_idx` ON `CustomerLedger`(`cashbookEntryId`);

-- Backfill the deterministic records created by older ERP releases.
UPDATE `CashbookEntry` AS `cb`
INNER JOIN `Sale` AS `s`
  ON `cb`.`reference` = `s`.`invoiceNumber`
 AND `cb`.`description` = CONCAT('Sale payment — ', `s`.`invoiceNumber`)
SET `cb`.`saleId` = `s`.`id`
WHERE `cb`.`saleId` IS NULL;

UPDATE `CashbookEntry` AS `cb`
INNER JOIN `UrdPurchase` AS `u`
  ON `cb`.`description` IN (
    CONCAT('URD purchase — ', `u`.`purchaseNumber`),
    CONCAT('URD payout — ', `u`.`purchaseNumber`)
  )
SET `cb`.`urdPurchaseId` = `u`.`id`
WHERE `cb`.`urdPurchaseId` IS NULL;

UPDATE `CustomerLedger` AS `cl`
INNER JOIN `CashbookEntry` AS `cb`
  ON `cb`.`syncLedger` = TRUE
 AND `cb`.`customerId` = `cl`.`customerId`
 AND (
      (`cb`.`reference` IS NOT NULL AND `cl`.`reference` = `cb`.`reference`)
   OR (`cb`.`reference` IS NULL AND (
        (`cb`.`type` = 'IN' AND `cl`.`note` = CONCAT('Payment via cashbook · ', `cb`.`description`))
     OR (`cb`.`type` = 'OUT' AND `cl`.`note` = CONCAT('Cashbook out · ', `cb`.`description`))
   ))
 )
 AND (
      (`cb`.`type` = 'IN' AND `cl`.`type` = 'PAYMENT_RECEIVED')
   OR (`cb`.`type` = 'OUT' AND `cl`.`type` = 'ADJUSTMENT')
 )
SET `cl`.`cashbookEntryId` = `cb`.`id`
WHERE `cl`.`cashbookEntryId` IS NULL;

-- Recover historical Card and Bank totals from their source cashbook and
-- customer-ledger movements. Cash and UPI already had dedicated columns.
UPDATE `Sale` AS `s`
SET
  `s`.`cardPaid` =
    COALESCE((SELECT SUM(`cb`.`amount`) FROM `CashbookEntry` AS `cb` WHERE `cb`.`saleId` = `s`.`id` AND `cb`.`paymentMethod` = 'CARD'), 0)
    + COALESCE((SELECT SUM(-`cl`.`amount`) FROM `CustomerLedger` AS `cl` WHERE `cl`.`saleId` = `s`.`id` AND `cl`.`type` = 'PAYMENT_RECEIVED' AND `cl`.`paymentMethod` = 'CARD'), 0),
  `s`.`bankPaid` =
    COALESCE((SELECT SUM(`cb`.`amount`) FROM `CashbookEntry` AS `cb` WHERE `cb`.`saleId` = `s`.`id` AND `cb`.`paymentMethod` = 'BANK_TRANSFER'), 0)
    + COALESCE((SELECT SUM(-`cl`.`amount`) FROM `CustomerLedger` AS `cl` WHERE `cl`.`saleId` = `s`.`id` AND `cl`.`type` = 'PAYMENT_RECEIVED' AND `cl`.`paymentMethod` = 'BANK_TRANSFER'), 0);

ALTER TABLE `CashbookEntry`
  ADD CONSTRAINT `CashbookEntry_saleId_fkey`
    FOREIGN KEY (`saleId`) REFERENCES `Sale`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `CashbookEntry_urdPurchaseId_fkey`
    FOREIGN KEY (`urdPurchaseId`) REFERENCES `UrdPurchase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `CustomerLedger`
  ADD CONSTRAINT `CustomerLedger_cashbookEntryId_fkey`
    FOREIGN KEY (`cashbookEntryId`) REFERENCES `CashbookEntry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
