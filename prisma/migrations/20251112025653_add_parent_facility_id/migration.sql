-- Add missing columns to facility table for production database
-- This migration adds columns that exist in the schema but may be missing in production

-- Add parent_facility_id column (nullable, for facility hierarchy - clinics under subcentres)
ALTER TABLE "facility" ADD COLUMN IF NOT EXISTS "parent_facility_id" VARCHAR;

-- Add has_clinic column (boolean, indicates if facility has clinic infrastructure for Long Roll)
ALTER TABLE "facility" ADD COLUMN IF NOT EXISTS "has_clinic" BOOLEAN NOT NULL DEFAULT false;

-- Add index for parent_facility_id
CREATE INDEX IF NOT EXISTS "facility_parent_facility_id_idx" ON "facility"("parent_facility_id");

-- Add index for has_clinic
CREATE INDEX IF NOT EXISTS "facility_has_clinic_idx" ON "facility"("has_clinic");

-- Add foreign key constraint for parent_facility_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'facility_parent_facility_id_fkey'
    ) THEN
        ALTER TABLE "facility" 
        ADD CONSTRAINT "facility_parent_facility_id_fkey" 
        FOREIGN KEY ("parent_facility_id") 
        REFERENCES "facility"("id") 
        ON DELETE RESTRICT;
    END IF;
END $$;

