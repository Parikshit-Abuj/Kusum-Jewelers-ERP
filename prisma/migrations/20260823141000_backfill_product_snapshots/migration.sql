-- Preserve the item description on invoices and purchase records created before
-- product snapshot fields were introduced.  This must run before old zero-stock
-- products are permanently removed from inventory.
UPDATE `SaleItem` AS `si`
INNER JOIN `Product` AS `p` ON `p`.`id` = `si`.`productId`
SET
  `si`.`productBarcode` = `p`.`barcode`,
  `si`.`productSku` = `p`.`sku`,
  `si`.`productName` = `p`.`name`,
  `si`.`productMetal` = `p`.`metal`,
  `si`.`productPurity` = `p`.`purity`,
  `si`.`grossWeight` = `p`.`grossWeight`
WHERE `si`.`productName` = '';

UPDATE `PurchaseItem` AS `pi`
INNER JOIN `Product` AS `p` ON `p`.`id` = `pi`.`productId`
SET
  `pi`.`productSku` = `p`.`sku`,
  `pi`.`productName` = `p`.`name`
WHERE `pi`.`productName` = '';
