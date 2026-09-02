-- Preserve cancelled documents as audit records without treating them as
-- active sales or active URD purchases.
ALTER TABLE `Sale` ADD COLUMN `cancelledAt` DATETIME(3) NULL;
ALTER TABLE `UrdPurchase` ADD COLUMN `cancelledAt` DATETIME(3) NULL;
CREATE INDEX `Sale_cancelledAt_saleDate_idx` ON `Sale`(`cancelledAt`, `saleDate`);
CREATE INDEX `UrdPurchase_cancelledAt_purchaseDate_idx` ON `UrdPurchase`(`cancelledAt`, `purchaseDate`);
