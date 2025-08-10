-- CreateTable
CREATE TABLE "FacilityRemunerationRecord" (
    "id" TEXT NOT NULL,
    "facility_id" TEXT NOT NULL,
    "report_month" TEXT NOT NULL,
    "indicator_id" INTEGER,
    "worker_id" INTEGER,
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

    CONSTRAINT "FacilityRemunerationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FacilityRemunerationRecord_facility_id_report_month_idx" ON "FacilityRemunerationRecord"("facility_id", "report_month");

-- CreateIndex
CREATE INDEX "FacilityRemunerationRecord_report_month_idx" ON "FacilityRemunerationRecord"("report_month");

-- CreateIndex
CREATE INDEX "FacilityRemunerationRecord_indicator_id_idx" ON "FacilityRemunerationRecord"("indicator_id");

-- CreateIndex
CREATE INDEX "FacilityRemunerationRecord_worker_id_idx" ON "FacilityRemunerationRecord"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "FacilityRemunerationRecord_facility_id_report_month_indicat_key" ON "FacilityRemunerationRecord"("facility_id", "report_month", "indicator_id", "worker_id");

-- AddForeignKey
ALTER TABLE "FacilityRemunerationRecord" ADD CONSTRAINT "FacilityRemunerationRecord_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilityRemunerationRecord" ADD CONSTRAINT "FacilityRemunerationRecord_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilityRemunerationRecord" ADD CONSTRAINT "FacilityRemunerationRecord_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "health_workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
