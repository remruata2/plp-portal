/*
  Warnings:

  - The primary key for the `district` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `district` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `district` table. All the data in the column will be lost.
  - The primary key for the `facility` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `district_id` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `facility_code` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `facility_type_id` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `nin` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `facility_id` on the `facility_field_defaults` table. All the data in the column will be lost.
  - You are about to drop the column `facility_type_id` on the `facility_field_mapping` table. All the data in the column will be lost.
  - You are about to drop the column `facility_id` on the `facility_target` table. All the data in the column will be lost.
  - The primary key for the `facility_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `facility_type` table. All the data in the column will be lost.
  - You are about to drop the column `display_name` on the `facility_type` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `facility_type` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `facility_type` table. All the data in the column will be lost.
  - You are about to drop the column `facility_type_id` on the `facility_type_remuneration` table. All the data in the column will be lost.
  - You are about to drop the column `facility_id` on the `field_value` table. All the data in the column will be lost.
  - You are about to drop the column `facility_id` on the `indicator_configuration` table. All the data in the column will be lost.
  - You are about to drop the column `facility_type_id` on the `indicator_configuration` table. All the data in the column will be lost.
  - You are about to drop the column `district_id` on the `monthly_health_data` table. All the data in the column will be lost.
  - You are about to drop the column `facility_id` on the `monthly_health_data` table. All the data in the column will be lost.
  - You are about to drop the column `facility_id` on the `performance_calculation` table. All the data in the column will be lost.
  - You are about to drop the column `facility_id` on the `sub_centre` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,districtId]` on the table `facility` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[field_id,facilityId]` on the table `facility_field_defaults` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facilityTypeId,field_id]` on the table `facility_field_mapping` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facilityId,indicator_id,report_month]` on the table `facility_target` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facilityTypeId]` on the table `facility_type_remuneration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[field_id,facilityId,report_month]` on the table `field_value` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[indicator_id,facilityTypeId]` on the table `indicator_configuration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facilityId,sub_centre_id,indicator_id,report_month]` on the table `monthly_health_data` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facilityId,sub_centre_id,indicator_id,report_month]` on the table `performance_calculation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `district` table without a default value. This is not possible if the table is not empty.
  - Added the required column `districtId` to the `facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilityTypeId` to the `facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilityId` to the `facility_field_defaults` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilityTypeId` to the `facility_field_mapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilityId` to the `facility_target` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `facility_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `facility_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilityTypeId` to the `facility_type_remuneration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `districtId` to the `monthly_health_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilityId` to the `sub_centre` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "facility" DROP CONSTRAINT "facility_district_id_fkey";

-- DropForeignKey
ALTER TABLE "facility" DROP CONSTRAINT "facility_facility_type_id_fkey";

-- DropForeignKey
ALTER TABLE "facility_field_defaults" DROP CONSTRAINT "facility_field_defaults_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "facility_field_mapping" DROP CONSTRAINT "facility_field_mapping_facility_type_id_fkey";

-- DropForeignKey
ALTER TABLE "facility_target" DROP CONSTRAINT "facility_target_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "facility_type_remuneration" DROP CONSTRAINT "facility_type_remuneration_facility_type_id_fkey";

-- DropForeignKey
ALTER TABLE "field_value" DROP CONSTRAINT "field_value_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "indicator_configuration" DROP CONSTRAINT "indicator_configuration_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "indicator_configuration" DROP CONSTRAINT "indicator_configuration_facility_type_id_fkey";

-- DropForeignKey
ALTER TABLE "monthly_health_data" DROP CONSTRAINT "monthly_health_data_district_id_fkey";

-- DropForeignKey
ALTER TABLE "monthly_health_data" DROP CONSTRAINT "monthly_health_data_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "performance_calculation" DROP CONSTRAINT "performance_calculation_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "sub_centre" DROP CONSTRAINT "sub_centre_facility_id_fkey";

-- DropIndex
DROP INDEX "facility_district_id_idx";

-- DropIndex
DROP INDEX "facility_facility_code_key";

-- DropIndex
DROP INDEX "facility_facility_type_id_idx";

-- DropIndex
DROP INDEX "facility_nin_key";

-- DropIndex
DROP INDEX "facility_field_defaults_field_id_facility_id_key";

-- DropIndex
DROP INDEX "facility_field_mapping_facility_type_id_field_id_key";

-- DropIndex
DROP INDEX "facility_target_facility_id_indicator_id_report_month_key";

-- DropIndex
DROP INDEX "facility_type_remuneration_facility_type_id_key";

-- DropIndex
DROP INDEX "field_value_field_id_facility_id_report_month_key";

-- DropIndex
DROP INDEX "indicator_configuration_indicator_id_facility_type_id_key";

-- DropIndex
DROP INDEX "monthly_health_data_district_id_idx";

-- DropIndex
DROP INDEX "monthly_health_data_facility_id_sub_centre_id_indicator_id__key";

-- DropIndex
DROP INDEX "performance_calculation_facility_id_sub_centre_id_indicator_key";

-- DropIndex
DROP INDEX "sub_centre_facility_id_idx";

-- AlterTable
ALTER TABLE "district" DROP CONSTRAINT "district_pkey",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ADD CONSTRAINT "district_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "district_id_seq";

-- AlterTable
ALTER TABLE "facility" DROP CONSTRAINT "facility_pkey",
DROP COLUMN "created_at",
DROP COLUMN "district_id",
DROP COLUMN "facility_code",
DROP COLUMN "facility_type_id",
DROP COLUMN "nin",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "districtId" TEXT NOT NULL,
ADD COLUMN     "facilityTypeId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ADD CONSTRAINT "facility_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "facility_id_seq";

-- AlterTable
ALTER TABLE "facility_field_defaults" DROP COLUMN "facility_id",
ADD COLUMN     "facilityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "facility_field_mapping" DROP COLUMN "facility_type_id",
ADD COLUMN     "facilityTypeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "facility_target" DROP COLUMN "facility_id",
ADD COLUMN     "facilityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "facility_type" DROP CONSTRAINT "facility_type_pkey",
DROP COLUMN "created_at",
DROP COLUMN "display_name",
DROP COLUMN "is_active",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ADD CONSTRAINT "facility_type_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "facility_type_id_seq";

-- AlterTable
ALTER TABLE "facility_type_remuneration" DROP COLUMN "facility_type_id",
ADD COLUMN     "facilityTypeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "field_value" DROP COLUMN "facility_id",
ADD COLUMN     "facilityId" TEXT;

-- AlterTable
ALTER TABLE "indicator_configuration" DROP COLUMN "facility_id",
DROP COLUMN "facility_type_id",
ADD COLUMN     "facilityId" TEXT,
ADD COLUMN     "facilityTypeId" TEXT;

-- AlterTable
ALTER TABLE "monthly_health_data" DROP COLUMN "district_id",
DROP COLUMN "facility_id",
ADD COLUMN     "districtId" TEXT NOT NULL,
ADD COLUMN     "facilityId" TEXT;

-- AlterTable
ALTER TABLE "performance_calculation" DROP COLUMN "facility_id",
ADD COLUMN     "facilityId" TEXT;

-- AlterTable
ALTER TABLE "sub_centre" DROP COLUMN "facility_id",
ADD COLUMN     "facilityId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "facility_facilityTypeId_idx" ON "facility"("facilityTypeId");

-- CreateIndex
CREATE INDEX "facility_districtId_idx" ON "facility"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "facility_name_districtId_key" ON "facility"("name", "districtId");

-- CreateIndex
CREATE UNIQUE INDEX "facility_field_defaults_field_id_facilityId_key" ON "facility_field_defaults"("field_id", "facilityId");

-- CreateIndex
CREATE UNIQUE INDEX "facility_field_mapping_facilityTypeId_field_id_key" ON "facility_field_mapping"("facilityTypeId", "field_id");

-- CreateIndex
CREATE UNIQUE INDEX "facility_target_facilityId_indicator_id_report_month_key" ON "facility_target"("facilityId", "indicator_id", "report_month");

-- CreateIndex
CREATE UNIQUE INDEX "facility_type_remuneration_facilityTypeId_key" ON "facility_type_remuneration"("facilityTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "field_value_field_id_facilityId_report_month_key" ON "field_value"("field_id", "facilityId", "report_month");

-- CreateIndex
CREATE UNIQUE INDEX "indicator_configuration_indicator_id_facilityTypeId_key" ON "indicator_configuration"("indicator_id", "facilityTypeId");

-- CreateIndex
CREATE INDEX "monthly_health_data_districtId_idx" ON "monthly_health_data"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_health_data_facilityId_sub_centre_id_indicator_id_r_key" ON "monthly_health_data"("facilityId", "sub_centre_id", "indicator_id", "report_month");

-- CreateIndex
CREATE UNIQUE INDEX "performance_calculation_facilityId_sub_centre_id_indicator__key" ON "performance_calculation"("facilityId", "sub_centre_id", "indicator_id", "report_month");

-- CreateIndex
CREATE INDEX "sub_centre_facilityId_idx" ON "sub_centre"("facilityId");

-- AddForeignKey
ALTER TABLE "facility" ADD CONSTRAINT "facility_facilityTypeId_fkey" FOREIGN KEY ("facilityTypeId") REFERENCES "facility_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility" ADD CONSTRAINT "facility_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_health_data" ADD CONSTRAINT "monthly_health_data_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_health_data" ADD CONSTRAINT "monthly_health_data_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_value" ADD CONSTRAINT "field_value_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_field_defaults" ADD CONSTRAINT "facility_field_defaults_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_field_mapping" ADD CONSTRAINT "facility_field_mapping_facilityTypeId_fkey" FOREIGN KEY ("facilityTypeId") REFERENCES "facility_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_centre" ADD CONSTRAINT "sub_centre_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_type_remuneration" ADD CONSTRAINT "facility_type_remuneration_facilityTypeId_fkey" FOREIGN KEY ("facilityTypeId") REFERENCES "facility_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_calculation" ADD CONSTRAINT "performance_calculation_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_configuration" ADD CONSTRAINT "indicator_configuration_facilityTypeId_fkey" FOREIGN KEY ("facilityTypeId") REFERENCES "facility_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_configuration" ADD CONSTRAINT "indicator_configuration_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_target" ADD CONSTRAINT "facility_target_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
