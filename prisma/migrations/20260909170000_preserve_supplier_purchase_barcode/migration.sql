-- A product row is intentionally removed from live inventory after billing.
-- Keep the original physical barcode in the supplier-purchase history so
-- purchase registers remain complete after that sale.
ALTER TABLE `SupplierPurchase` ADD COLUMN `barcode` VARCHAR(64) NULL;
UPDATE `SupplierPurchase` sp
INNER JOIN `Product` p ON p.`id` = sp.`productId`
SET sp.`barcode` = p.`barcode`
WHERE sp.`barcode` IS NULL;
CREATE INDEX `SupplierPurchase_barcode_idx` ON `SupplierPurchase`(`barcode`);
