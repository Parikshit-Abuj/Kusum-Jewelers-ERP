-- Scheme receipt numbers are independent for each scheme plan. Existing
-- date-based numbers remain valid; new enrollments use SCH-1, SCH-2, ... per
-- plan and are protected by the composite unique index below.
ALTER TABLE `SchemeEnrollment`
  DROP INDEX `SchemeEnrollment_enrollmentNumber_key`;

CREATE UNIQUE INDEX `SchemeEnrollment_schemePlanId_enrollmentNumber_key`
  ON `SchemeEnrollment`(`schemePlanId`, `enrollmentNumber`);
