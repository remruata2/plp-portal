-- Quick SQL queries to check if columns exist in production database

-- Check if has_clinic column exists
SELECT EXISTS (
  SELECT 1
  FROM information_schema.columns
  WHERE table_schema = 'public'
  AND table_name = 'facility'
  AND column_name = 'has_clinic'
) as has_clinic_exists;

-- Check if parent_facility_id column exists
SELECT EXISTS (
  SELECT 1
  FROM information_schema.columns
  WHERE table_schema = 'public'
  AND table_name = 'facility'
  AND column_name = 'parent_facility_id'
) as parent_facility_id_exists;

-- List all columns in facility table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'facility'
ORDER BY ordinal_position;
