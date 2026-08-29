-- Reconstruct recoverable historical payment components without changing the
-- invoice total, paid amount or balance. Initial sale payments are represented
-- by sale-linked cashbook rows; later receipts are represented by sale-linked
-- customer-ledger rows. They do not overlap in Kusum ERP's accounting model.
UPDATE `Sale` AS `s`
SET
  `s`.`cashPaid` = GREATEST(
    `s`.`cashPaid`,
    COALESCE((SELECT SUM(`cb`.`amount`) FROM `CashbookEntry` AS `cb` WHERE `cb`.`saleId` = `s`.`id` AND `cb`.`type` = 'IN' AND `cb`.`paymentMethod` = 'CASH'), 0)
      + COALESCE((SELECT SUM(-`cl`.`amount`) FROM `CustomerLedger` AS `cl` WHERE `cl`.`saleId` = `s`.`id` AND `cl`.`type` = 'PAYMENT_RECEIVED' AND `cl`.`amount` < 0 AND `cl`.`paymentMethod` = 'CASH'), 0)
  ),
  `s`.`upiPaid` = GREATEST(
    `s`.`upiPaid`,
    COALESCE((SELECT SUM(`cb`.`amount`) FROM `CashbookEntry` AS `cb` WHERE `cb`.`saleId` = `s`.`id` AND `cb`.`type` = 'IN' AND `cb`.`paymentMethod` = 'UPI'), 0)
      + COALESCE((SELECT SUM(-`cl`.`amount`) FROM `CustomerLedger` AS `cl` WHERE `cl`.`saleId` = `s`.`id` AND `cl`.`type` = 'PAYMENT_RECEIVED' AND `cl`.`amount` < 0 AND `cl`.`paymentMethod` = 'UPI'), 0)
  ),
  `s`.`cardPaid` = GREATEST(
    `s`.`cardPaid`,
    COALESCE((SELECT SUM(`cb`.`amount`) FROM `CashbookEntry` AS `cb` WHERE `cb`.`saleId` = `s`.`id` AND `cb`.`type` = 'IN' AND `cb`.`paymentMethod` = 'CARD'), 0)
      + COALESCE((SELECT SUM(-`cl`.`amount`) FROM `CustomerLedger` AS `cl` WHERE `cl`.`saleId` = `s`.`id` AND `cl`.`type` = 'PAYMENT_RECEIVED' AND `cl`.`amount` < 0 AND `cl`.`paymentMethod` = 'CARD'), 0)
  ),
  `s`.`bankPaid` = GREATEST(
    `s`.`bankPaid`,
    COALESCE((SELECT SUM(`cb`.`amount`) FROM `CashbookEntry` AS `cb` WHERE `cb`.`saleId` = `s`.`id` AND `cb`.`type` = 'IN' AND `cb`.`paymentMethod` = 'BANK_TRANSFER'), 0)
      + COALESCE((SELECT SUM(-`cl`.`amount`) FROM `CustomerLedger` AS `cl` WHERE `cl`.`saleId` = `s`.`id` AND `cl`.`type` = 'PAYMENT_RECEIVED' AND `cl`.`amount` < 0 AND `cl`.`paymentMethod` = 'BANK_TRANSFER'), 0)
  );

-- Very old single-method invoices did not yet have component columns. Their
-- recorded paymentMethod is sufficient to assign any still-unallocated paid
-- amount exactly. Existing split amounts are retained.
UPDATE `Sale`
SET `cashPaid` = `cashPaid` + GREATEST(0, `paid` - (`cashPaid` + `upiPaid` + `cardPaid` + `bankPaid`))
WHERE `paymentMethod` = 'CASH' AND `paid` > (`cashPaid` + `upiPaid` + `cardPaid` + `bankPaid`);

UPDATE `Sale`
SET `upiPaid` = `upiPaid` + GREATEST(0, `paid` - (`cashPaid` + `upiPaid` + `cardPaid` + `bankPaid`))
WHERE `paymentMethod` = 'UPI' AND `paid` > (`cashPaid` + `upiPaid` + `cardPaid` + `bankPaid`);

UPDATE `Sale`
SET `cardPaid` = `cardPaid` + GREATEST(0, `paid` - (`cashPaid` + `upiPaid` + `cardPaid` + `bankPaid`))
WHERE `paymentMethod` = 'CARD' AND `paid` > (`cashPaid` + `upiPaid` + `cardPaid` + `bankPaid`);

UPDATE `Sale`
SET `bankPaid` = `bankPaid` + GREATEST(0, `paid` - (`cashPaid` + `upiPaid` + `cardPaid` + `bankPaid`))
WHERE `paymentMethod` = 'BANK_TRANSFER' AND `paid` > (`cashPaid` + `upiPaid` + `cardPaid` + `bankPaid`);
