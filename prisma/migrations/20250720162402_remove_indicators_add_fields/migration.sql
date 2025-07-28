/*
  Warnings:

  - You are about to drop the column `indicator_id` on the `monthly_health_data` table. All the data in the column will be lost.
  - You are about to drop the `indicator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `indicator_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `indicator_target` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[facility_id,sub_centre_id,report_month]` on the table `monthly_health_data` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "indicator" DROP CONSTRAINT "indicator_category_id_fkey";

-- DropForeignKey
ALTER TABLE "indicator_target" DROP CONSTRAINT "indicator_target_district_id_fkey";

-- DropForeignKey
ALTER TABLE "indicator_target" DROP CONSTRAINT "indicator_target_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "indicator_target" DROP CONSTRAINT "indicator_target_indicator_id_fkey";

-- DropForeignKey
ALTER TABLE "monthly_health_data" DROP CONSTRAINT "monthly_health_data_indicator_id_fkey";

-- DropIndex
DROP INDEX "monthly_health_data_indicator_id_facility_id_sub_centre_id__key";

-- DropIndex
DROP INDEX "monthly_health_data_indicator_id_idx";

-- AlterTable
ALTER TABLE "monthly_health_data" DROP COLUMN "indicator_id";

-- DropTable
DROP TABLE "indicator";

-- DropTable
DROP TABLE "indicator_category";

-- DropTable
DROP TABLE "indicator_target";

-- CreateTable
CREATE TABLE "field" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "field_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "field_code_key" ON "field"("code");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_health_data_facility_id_sub_centre_id_report_month_key" ON "monthly_health_data"("facility_id", "sub_centre_id", "report_month");
