-- AlterTable
ALTER TABLE `Customer` ADD COLUMN `panNumber` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `batchDocNo` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Product_batchDocNo_idx` ON `Product`(`batchDocNo`);

-- AlterTable
ALTER TABLE `Sale` ADD COLUMN `customerPan` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `SaleItem` ADD COLUMN `hsnCode` VARCHAR(50) NULL,
    ADD COLUMN `huidCode` VARCHAR(50) NULL;
