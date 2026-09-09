-- A supplier bill can represent a lot of physical pieces. Inventory barcodes
-- are deliberately assigned later, one per piece, in Batch Add Pieces.
ALTER TABLE `SupplierPurchase` ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 1;
