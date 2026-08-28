CREATE TABLE `SyncRevision` (
  `id` INTEGER NOT NULL,
  `revision` BIGINT NOT NULL DEFAULT 0,
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `SyncRevision` (`id`, `revision`, `updatedAt`)
VALUES (1, 0, NOW(3))
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`);
