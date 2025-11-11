-- Add has_clinic column to facility table in production
-- This column was missing even though parent_facility_id exists

-- Add has_clinic column (boolean, indicates if facility has clinic infrastructure for Long Roll)
ALTER TABLE "facility" ADD COLUMN IF NOT EXISTS "has_clinic" BOOLEAN NOT NULL DEFAULT false;

-- Add index for has_clinic
CREATE INDEX IF NOT EXISTS "facility_has_clinic_idx" ON "facility"("has_clinic");

