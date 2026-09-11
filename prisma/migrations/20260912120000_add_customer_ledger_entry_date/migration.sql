-- Keep the ledger's accounting date separate from createdAt.  This preserves
-- the Windows-local date entered for a bill or receipt while retaining the
-- actual save timestamp for audit purposes.
ALTER TABLE `CustomerLedger`
  ADD COLUMN `entryDate` VARCHAR(10) NOT NULL DEFAULT '';

-- Existing sale credits inherit the invoice date.  Receipt allocations inherit
-- the Cashbook date, which is the date the user entered for that receipt.
UPDATE `CustomerLedger` AS `cl`
LEFT JOIN `CashbookEntry` AS `cb` ON `cb`.`id` = `cl`.`cashbookEntryId`
LEFT JOIN `Sale` AS `s` ON `s`.`id` = `cl`.`saleId`
SET `cl`.`entryDate` = COALESCE(
  NULLIF(`cb`.`entryDate`, ''),
  DATE_FORMAT(`s`.`saleDate`, '%Y-%m-%d'),
  DATE_FORMAT(`cl`.`createdAt`, '%Y-%m-%d')
);

ALTER TABLE `CustomerLedger`
  MODIFY COLUMN `entryDate` VARCHAR(10) NOT NULL;

CREATE INDEX `CustomerLedger_customerId_entryDate_idx`
  ON `CustomerLedger`(`customerId`, `entryDate`);
