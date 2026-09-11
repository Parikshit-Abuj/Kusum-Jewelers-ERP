UPDATE `BusinessSettings`
SET `shopAddress` = 'Vithal Bhagwan Complex, Beed Road, Majalgaon, Maharashtra, 431131'
WHERE `id` = 1
  AND `shopName` = 'Kusum Jewellers'
  AND (`shopAddress` IS NULL OR TRIM(`shopAddress`) = '');
