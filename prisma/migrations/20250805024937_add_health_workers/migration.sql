/*
  Warnings:

  - You are about to drop the column `createdAt` on the `district` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `district` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `district` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `createdAt` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `districtId` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `facilityTypeId` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `facility` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `facility` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to drop the column `facilityId` on the `facility_field_defaults` table. All the data in the column will be lost.
  - You are about to drop the column `facilityTypeId` on the `facility_field_mapping` table. All the data in the column will be lost.
  - You are about to drop the column `facilityId` on the `facility_target` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `facility_type` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `facility_type` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `facility_type` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `facility_type` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `facilityTypeId` on the `facility_type_remuneration` table. All the data in the column will be lost.
  - You are about to drop the column `facilityId` on the `field_value` table. All the data in the column will be lost.
  - You are about to drop the column `districtId` on the `monthly_health_data` table. All the data in the column will be lost.
  - You are about to drop the column `facilityId` on the `monthly_health_data` table. All the data in the column will be lost.
  - You are about to drop the column `facilityId` on the `performance_calculation` table. All the data in the column will be lost.
  - You are about to drop the column `facilityId` on the `sub_centre` table. All the data in the column will be lost.
  - You are about to drop the column `facility_code` on the `sub_centre` table. All the data in the column will be lost.
  - You are about to drop the column `nin` on the `sub_centre` table. All the data in the column will be lost.
  - You are about to drop the `indicator_configuration` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,district_id]` on the table `facility` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[field_id,facility_id]` on the table `facility_field_defaults` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facility_type_id,field_id]` on the table `facility_field_mapping` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facility_id,indicator_id,report_month]` on the table `facility_target` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facility_type_id]` on the table `facility_type_remuneration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[field_id,facility_id,report_month]` on the table `field_value` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facility_id,sub_centre_id,indicator_id,report_month]` on the table `monthly_health_data` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facility_id,sub_centre_id,indicator_id,report_month]` on the table `performance_calculation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `district` table without a default value. This is not possible if the table is not empty.
  - Added the required column `display_name` to the `facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district_id` to the `facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facility_type_id` to the `facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facility_id` to the `facility_field_defaults` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facility_type_id` to the `facility_field_mapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facility_id` to the `facility_target` table without a default value. This is not possible if the table is not empty.
  - Added the required column `display_name` to the `facility_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `facility_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facility_type_id` to the `facility_type_remuneration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district_id` to the `monthly_health_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facility_id` to the `sub_centre` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "facility" DROP CONSTRAINT "facility_districtId_fkey";

-- DropForeignKey
ALTER TABLE "facility" DROP CONSTRAINT "facility_facilityTypeId_fkey";

-- DropForeignKey
ALTER TABLE "facility_field_defaults" DROP CONSTRAINT "facility_field_defaults_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "facility_field_mapping" DROP CONSTRAINT "facility_field_mapping_facilityTypeId_fkey";

-- DropForeignKey
ALTER TABLE "facility_target" DROP CONSTRAINT "facility_target_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "facility_type_remuneration" DROP CONSTRAINT "facility_type_remuneration_facilityTypeId_fkey";

-- DropForeignKey
ALTER TABLE "field_value" DROP CONSTRAINT "field_value_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "indicator_configuration" DROP CONSTRAINT "indicator_configuration_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "indicator_configuration" DROP CONSTRAINT "indicator_configuration_facilityTypeId_fkey";

-- DropForeignKey
ALTER TABLE "indicator_configuration" DROP CONSTRAINT "indicator_configuration_indicator_id_fkey";

-- DropForeignKey
ALTER TABLE "monthly_health_data" DROP CONSTRAINT "monthly_health_data_districtId_fkey";

-- DropForeignKey
ALTER TABLE "monthly_health_data" DROP CONSTRAINT "monthly_health_data_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "performance_calculation" DROP CONSTRAINT "performance_calculation_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "sub_centre" DROP CONSTRAINT "sub_centre_facilityId_fkey";

-- DropIndex
DROP INDEX "facility_districtId_idx";

-- DropIndex
DROP INDEX "facility_facilityTypeId_idx";

-- DropIndex
DROP INDEX "facility_name_districtId_key";

-- DropIndex
DROP INDEX "facility_field_defaults_field_id_facilityId_key";

-- DropIndex
DROP INDEX "facility_field_mapping_facilityTypeId_field_id_key";

-- DropIndex
DROP INDEX "facility_target_facilityId_indicator_id_report_month_key";

-- DropIndex
DROP INDEX "facility_type_remuneration_facilityTypeId_key";

-- DropIndex
DROP INDEX "field_value_field_id_facilityId_report_month_key";

-- DropIndex
DROP INDEX "monthly_health_data_districtId_idx";

-- DropIndex
DROP INDEX "monthly_health_data_facilityId_sub_centre_id_indicator_id_r_key";

-- DropIndex
DROP INDEX "performance_calculation_facilityId_sub_centre_id_indicator__key";

-- DropIndex
DROP INDEX "sub_centre_facilityId_idx";

-- DropIndex
DROP INDEX "sub_centre_facility_code_key";

-- DropIndex
DROP INDEX "sub_centre_nin_key";

-- AlterTable
ALTER TABLE "district" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "facility" DROP COLUMN "createdAt",
DROP COLUMN "districtId",
DROP COLUMN "facilityTypeId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" VARCHAR(500),
ADD COLUMN     "display_name" VARCHAR(200) NOT NULL,
ADD COLUMN     "district_id" TEXT NOT NULL,
ADD COLUMN     "facility_type_id" TEXT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "facility_field_defaults" DROP COLUMN "facilityId",
ADD COLUMN     "facility_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "facility_field_mapping" DROP COLUMN "facilityTypeId",
ADD COLUMN     "facility_type_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "facility_target" DROP COLUMN "facilityId",
ADD COLUMN     "facility_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "facility_type" DROP COLUMN "createdAt",
DROP COLUMN "displayName",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" VARCHAR(500),
ADD COLUMN     "display_name" VARCHAR(200) NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "facility_type_remuneration" DROP COLUMN "facilityTypeId",
ADD COLUMN     "facility_type_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "field_value" DROP COLUMN "facilityId",
ADD COLUMN     "facility_id" TEXT;

-- AlterTable
ALTER TABLE "monthly_health_data" DROP COLUMN "districtId",
DROP COLUMN "facilityId",
ADD COLUMN     "district_id" TEXT NOT NULL,
ADD COLUMN     "facility_id" TEXT;

-- AlterTable
ALTER TABLE "performance_calculation" DROP COLUMN "facilityId",
ADD COLUMN     "facility_id" TEXT;

-- AlterTable
ALTER TABLE "sub_centre" DROP COLUMN "facilityId",
DROP COLUMN "facility_code",
DROP COLUMN "nin",
ADD COLUMN     "facility_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "facility_id" TEXT;

-- DropTable
DROP TABLE "indicator_configuration";

-- CreateTable
CREATE TABLE "health_workers" (
    "id" SERIAL NOT NULL,
    "facility_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "worker_type" TEXT NOT NULL,
    "allocated_amount" DECIMAL(10,2) NOT NULL,
    "contact_number" TEXT,
    "email" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "health_workers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "facility_district_id_idx" ON "facility"("district_id");

-- CreateIndex
CREATE INDEX "facility_facility_type_id_idx" ON "facility"("facility_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "facility_name_district_id_key" ON "facility"("name", "district_id");

-- CreateIndex
CREATE UNIQUE INDEX "facility_field_defaults_field_id_facility_id_key" ON "facility_field_defaults"("field_id", "facility_id");

-- CreateIndex
CREATE UNIQUE INDEX "facility_field_mapping_facility_type_id_field_id_key" ON "facility_field_mapping"("facility_type_id", "field_id");

-- CreateIndex
CREATE UNIQUE INDEX "facility_target_facility_id_indicator_id_report_month_key" ON "facility_target"("facility_id", "indicator_id", "report_month");

-- CreateIndex
CREATE UNIQUE INDEX "facility_type_remuneration_facility_type_id_key" ON "facility_type_remuneration"("facility_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "field_value_field_id_facility_id_report_month_key" ON "field_value"("field_id", "facility_id", "report_month");

-- CreateIndex
CREATE INDEX "monthly_health_data_district_id_idx" ON "monthly_health_data"("district_id");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_health_data_facility_id_sub_centre_id_indicator_id__key" ON "monthly_health_data"("facility_id", "sub_centre_id", "indicator_id", "report_month");

-- CreateIndex
CREATE UNIQUE INDEX "performance_calculation_facility_id_sub_centre_id_indicator_key" ON "performance_calculation"("facility_id", "sub_centre_id", "indicator_id", "report_month");

-- CreateIndex
CREATE INDEX "sub_centre_facility_id_idx" ON "sub_centre"("facility_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_facility_id_idx" ON "user"("facility_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility" ADD CONSTRAINT "facility_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility" ADD CONSTRAINT "facility_facility_type_id_fkey" FOREIGN KEY ("facility_type_id") REFERENCES "facility_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_health_data" ADD CONSTRAINT "monthly_health_data_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_health_data" ADD CONSTRAINT "monthly_health_data_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_value" ADD CONSTRAINT "field_value_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_field_defaults" ADD CONSTRAINT "facility_field_defaults_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_field_mapping" ADD CONSTRAINT "facility_field_mapping_facility_type_id_fkey" FOREIGN KEY ("facility_type_id") REFERENCES "facility_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_centre" ADD CONSTRAINT "sub_centre_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_workers" ADD CONSTRAINT "health_workers_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_type_remuneration" ADD CONSTRAINT "facility_type_remuneration_facility_type_id_fkey" FOREIGN KEY ("facility_type_id") REFERENCES "facility_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_calculation" ADD CONSTRAINT "performance_calculation_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_target" ADD CONSTRAINT "facility_target_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
