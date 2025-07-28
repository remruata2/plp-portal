/*
  Warnings:

  - A unique constraint covering the columns `[facility_id,sub_centre_id,indicator_id,report_month]` on the table `monthly_health_data` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "monthly_health_data_facility_id_sub_centre_id_report_month_key";

-- AlterTable
ALTER TABLE "monthly_health_data" ADD COLUMN     "indicator_id" INTEGER;

-- CreateIndex
CREATE INDEX "monthly_health_data_indicator_id_idx" ON "monthly_health_data"("indicator_id");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_health_data_facility_id_sub_centre_id_indicator_id__key" ON "monthly_health_data"("facility_id", "sub_centre_id", "indicator_id", "report_month");

-- AddForeignKey
ALTER TABLE "monthly_health_data" ADD CONSTRAINT "monthly_health_data_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
