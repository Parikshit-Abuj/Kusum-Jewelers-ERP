-- An installment has one place in a scheme and one originating Cashbook
-- receipt. These constraints make accidental double-posting impossible even
-- when two counter PCs submit a payment at the same time.
CREATE UNIQUE INDEX `SchemeInstallment_enrollmentId_installmentNumber_key`
ON `SchemeInstallment`(`enrollmentId`, `installmentNumber`);

CREATE UNIQUE INDEX `SchemeInstallment_cashbookEntryId_key`
ON `SchemeInstallment`(`cashbookEntryId`);
