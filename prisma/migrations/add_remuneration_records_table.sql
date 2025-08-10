-- Migration: Add facility remuneration records table
-- This table stores pre-calculated remuneration data to avoid recalculating every time reports are viewed

-- Create the facility_remuneration_records table
CREATE TABLE IF NOT EXISTS "facility_remuneration_records" (
    "id" TEXT NOT NULL,
    "facility_id" TEXT NOT NULL,
    "report_month" TEXT NOT NULL,
    "indicator_id" INTEGER,
    "worker_id" TEXT,
    "actual_value" DOUBLE PRECISION,
    "target_value" DOUBLE PRECISION,
    "percentage_achieved" DOUBLE PRECISION,
    "status" TEXT NOT NULL,
    "incentive_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "max_remuneration" DOUBLE PRECISION,
    "raw_percentage" DOUBLE PRECISION,
    "worker_type" TEXT,
    "worker_role" TEXT,
    "allocated_amount" DOUBLE PRECISION,
    "performance_percentage" DOUBLE PRECISION,
    "calculated_amount" DOUBLE PRECISION,
    "calculation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calculation_version" TEXT NOT NULL DEFAULT '1.0',
    
    CONSTRAINT "facility_remuneration_records_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "facility_remuneration_records" ADD CONSTRAINT "facility_remuneration_records_facility_id_fkey" 
    FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "facility_remuneration_records" ADD CONSTRAINT "facility_remuneration_records_indicator_id_fkey" 
    FOREIGN KEY ("indicator_id") REFERENCES "indicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "facility_remuneration_records" ADD CONSTRAINT "facility_remuneration_records_worker_id_fkey" 
    FOREIGN KEY ("worker_id") REFERENCES "health_workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create unique constraint
ALTER TABLE "facility_remuneration_records" ADD CONSTRAINT "facility_remuneration_records_unique" 
    UNIQUE ("facility_id", "report_month", "indicator_id", "worker_id");

-- Create indexes for performance
CREATE INDEX "facility_remuneration_records_facility_month_idx" ON "facility_remuneration_records"("facility_id", "report_month");
CREATE INDEX "facility_remuneration_records_month_idx" ON "facility_remuneration_records"("report_month");
CREATE INDEX "facility_remuneration_records_indicator_idx" ON "facility_remuneration_records"("indicator_id");
CREATE INDEX "facility_remuneration_records_worker_idx" ON "facility_remuneration_records"("worker_id");

-- Add comments
COMMENT ON TABLE "facility_remuneration_records" IS 'Stores pre-calculated remuneration data for facilities to improve report performance';
COMMENT ON COLUMN "facility_remuneration_records"."facility_id" IS 'Reference to the facility';
COMMENT ON COLUMN "facility_remuneration_records"."report_month" IS 'Report month in YYYY-MM format';
COMMENT ON COLUMN "facility_remuneration_records"."indicator_id" IS 'Reference to the performance indicator (if applicable)';
COMMENT ON COLUMN "facility_remuneration_records"."worker_id" IS 'Reference to the health worker (if applicable)';
COMMENT ON COLUMN "facility_remuneration_records"."status" IS 'Performance status: achieved, partial, not_achieved, or worker_remuneration';
COMMENT ON COLUMN "facility_remuneration_records"."incentive_amount" IS 'Calculated incentive amount for the indicator';
COMMENT ON COLUMN "facility_remuneration_records"."calculated_amount" IS 'Calculated remuneration amount for the worker';
