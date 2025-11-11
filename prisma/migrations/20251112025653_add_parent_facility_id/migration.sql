-- Add parent_facility_id column to facility table
-- This column is used for facility hierarchy (clinics under subcentres)

-- Add the column (nullable, as it's optional)
ALTER TABLE "facility" ADD COLUMN IF NOT EXISTS "parent_facility_id" VARCHAR;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS "facility_parent_facility_id_idx" ON "facility"("parent_facility_id");

-- Add foreign key constraint
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

