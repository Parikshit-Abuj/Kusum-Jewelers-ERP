-- These movements belonged only to the removed supplier purchase workflow.
DELETE FROM `StockMovement`
WHERE `type` = 'PURCHASE';

ALTER TABLE `StockMovement`
  MODIFY COLUMN `type` ENUM('OPENING', 'SALE', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT') NOT NULL;
