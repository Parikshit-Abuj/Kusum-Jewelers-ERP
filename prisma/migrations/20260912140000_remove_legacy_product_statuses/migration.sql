-- Product availability is represented by a positive quantity. Normalize old
-- status values before narrowing the enum so restored databases remain valid.
UPDATE `Product`
SET `status` = 'AVAILABLE'
WHERE `status` IN ('SOLD_OUT', 'INACTIVE');

ALTER TABLE `Product`
  MODIFY COLUMN `status` ENUM('AVAILABLE') NOT NULL DEFAULT 'AVAILABLE';
