CREATE TABLE `BusinessSettings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `shopName` VARCHAR(255) NOT NULL DEFAULT 'Kusum Jewellers',
    `shopAddress` TEXT NULL,
    `gstin` VARCHAR(20) NULL,
    `panNumber` VARCHAR(20) NULL,
    `primaryPhone` VARCHAR(30) NULL,
    `secondaryPhone` VARCHAR(30) NULL,
    `facebookUrl` VARCHAR(1000) NULL,
    `instagramUrl` VARCHAR(1000) NULL,
    `invoicePrefix` VARCHAR(12) NOT NULL DEFAULT 'SB',
    `financialYearStartMonth` INTEGER NOT NULL DEFAULT 4,
    `defaultGstRate` DECIMAL(5, 2) NOT NULL DEFAULT 3,
    `defaultHsnCode` VARCHAR(50) NULL,
    `labelShopName` VARCHAR(80) NOT NULL DEFAULT 'KUSUM JEWELLERS',
    `labelWidthMm` DECIMAL(6, 2) NOT NULL DEFAULT 81,
    `labelHeightMm` DECIMAL(6, 2) NOT NULL DEFAULT 12,
    `labelGapMm` DECIMAL(6, 2) NOT NULL DEFAULT 3,
    `labelSpeed` INTEGER NOT NULL DEFAULT 2,
    `labelDensity` INTEGER NOT NULL DEFAULT 10,
    `signatureImage` LONGBLOB NULL,
    `signatureMimeType` VARCHAR(50) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `BusinessSettings` (
  `id`, `shopName`, `gstin`, `primaryPhone`, `secondaryPhone`,
  `facebookUrl`, `instagramUrl`, `invoicePrefix`, `financialYearStartMonth`,
  `defaultGstRate`, `defaultHsnCode`, `labelShopName`
) VALUES (
  1, 'Kusum Jewellers', '27ABDFK0780F1ZG', '9970737444', '9404023751',
  'https://www.facebook.com/share/1CXw42f8Fb/',
  'https://www.instagram.com/kusum_jewellers_majalgaon7?igsi=MTFoaTAxYjM0Njk3',
  'SB', 4, 3, '7113', 'KUSUM JEWELLERS'
);
