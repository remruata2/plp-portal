/*
  Warnings:

  - You are about to drop the column `allocated_amount` on the `FacilityRemunerationRecord` table. All the data in the column will be lost.
  - You are about to drop the column `calculated_amount` on the `FacilityRemunerationRecord` table. All the data in the column will be lost.
  - You are about to drop the column `performance_percentage` on the `FacilityRemunerationRecord` table. All the data in the column will be lost.
  - You are about to drop the column `worker_id` on the `FacilityRemunerationRecord` table. All the data in the column will be lost.
  - You are about to drop the column `worker_role` on the `FacilityRemunerationRecord` table. All the data in the column will be lost.
  - You are about to drop the column `worker_type` on the `FacilityRemunerationRecord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[facility_id,report_month,indicator_id]` on the table `FacilityRemunerationRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "FacilityRemunerationRecord" DROP CONSTRAINT "FacilityRemunerationRecord_worker_id_fkey";

-- DropIndex
DROP INDEX "FacilityRemunerationRecord_facility_id_report_month_indicat_key";

-- DropIndex
DROP INDEX "FacilityRemunerationRecord_worker_id_idx";

-- AlterTable
ALTER TABLE "FacilityRemunerationRecord" DROP COLUMN "allocated_amount",
DROP COLUMN "calculated_amount",
DROP COLUMN "performance_percentage",
DROP COLUMN "worker_id",
DROP COLUMN "worker_role",
DROP COLUMN "worker_type";

-- CreateIndex
CREATE UNIQUE INDEX "FacilityRemunerationRecord_facility_id_report_month_indicat_key" ON "FacilityRemunerationRecord"("facility_id", "report_month", "indicator_id");
