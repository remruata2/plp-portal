/*
  Warnings:

  - You are about to drop the `facility_remuneration_record` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `facility_id` to the `worker_remunerations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `worker_role` to the `worker_remunerations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `worker_type` to the `worker_remunerations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "facility_remuneration_record" DROP CONSTRAINT "facility_remuneration_record_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "facility_remuneration_record" DROP CONSTRAINT "facility_remuneration_record_indicator_id_fkey";

-- DropForeignKey
ALTER TABLE "facility_remuneration_record" DROP CONSTRAINT "facility_remuneration_record_worker_id_fkey";

-- AlterTable
ALTER TABLE "worker_remunerations" ADD COLUMN     "facility_id" TEXT NOT NULL,
ADD COLUMN     "worker_role" TEXT NOT NULL,
ADD COLUMN     "worker_type" TEXT NOT NULL;

-- DropTable
DROP TABLE "facility_remuneration_record";

-- CreateTable
CREATE TABLE "FacilityRemunerationRecord" (
    "id" TEXT NOT NULL,
    "facility_id" TEXT NOT NULL,
    "report_month" TEXT NOT NULL,
    "indicator_id" INTEGER,
    "worker_id" INTEGER,
    "actual_value" DOUBLE PRECISION,
    "target_value" JSONB,
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
    "kpi_config_snapshot" JSONB,
    "remuneration_formula_snapshot" JSONB,
    "worker_allocation_snapshot" JSONB,
    "calculation_metadata" JSONB,

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
CREATE INDEX "FacilityRemunerationRecord_calculation_version_idx" ON "FacilityRemunerationRecord"("calculation_version");

-- CreateIndex
CREATE UNIQUE INDEX "FacilityRemunerationRecord_facility_id_report_month_indicat_key" ON "FacilityRemunerationRecord"("facility_id", "report_month", "indicator_id", "worker_id");

-- CreateIndex
CREATE INDEX "worker_remunerations_facility_id_report_month_idx" ON "worker_remunerations"("facility_id", "report_month");

-- CreateIndex
CREATE INDEX "worker_remunerations_worker_type_idx" ON "worker_remunerations"("worker_type");

-- AddForeignKey
ALTER TABLE "worker_remunerations" ADD CONSTRAINT "worker_remunerations_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilityRemunerationRecord" ADD CONSTRAINT "FacilityRemunerationRecord_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilityRemunerationRecord" ADD CONSTRAINT "FacilityRemunerationRecord_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilityRemunerationRecord" ADD CONSTRAINT "FacilityRemunerationRecord_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "health_workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
