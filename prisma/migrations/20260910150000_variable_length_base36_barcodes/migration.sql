-- Allow the atomic barcode counters to cover the complete 1–6 character
-- Base-36 range. The visible barcode remains prefix + one space + suffix.
-- Existing values and existing labels are preserved; only the counter type
-- changes so values above the signed INT limit remain safe.
ALTER TABLE `BarcodeSequence`
  MODIFY `lastNumber` BIGINT UNSIGNED NOT NULL DEFAULT 0;
