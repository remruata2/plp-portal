/*
  Warnings:

  - The values [CALCULATED,AGGREGATED,PERCENTAGE] on the enum `calculation_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `category_id` on the `indicator` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `indicator` table. All the data in the column will be lost.
  - You are about to drop the column `data_source` on the `indicator` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `indicator` table. All the data in the column will be lost.
  - You are about to drop the column `target_value` on the `indicator` table. All the data in the column will be lost.
  - You are about to drop the column `achievement` on the `monthly_health_data` table. All the data in the column will be lost.
  - You are about to drop the column `denominator` on the `monthly_health_data` table. All the data in the column will be lost.
  - You are about to drop the column `numerator` on the `monthly_health_data` table. All the data in the column will be lost.
  - You are about to drop the column `target_value` on the `monthly_health_data` table. All the data in the column will be lost.
  - You are about to drop the `indicator_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `indicator_target` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[field_id,indicator_id,facility_id,sub_centre_id,report_month]` on the table `monthly_health_data` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_type` to the `data_upload_session` table without a default value. This is not possible if the table is not empty.
  - Made the column `value` on table `monthly_health_data` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "field_type" AS ENUM ('NUMBER', 'PERCENTAGE');

-- AlterEnum
BEGIN;
CREATE TYPE "calculation_type_new" AS ENUM ('DIRECT_INPUT', 'FORMULA_BASED');
ALTER TABLE "indicator" ALTER COLUMN "calculation_type" DROP DEFAULT;
ALTER TABLE "indicator" ALTER COLUMN "calculation_type" TYPE "calculation_type_new" USING ("calculation_type"::text::"calculation_type_new");
ALTER TYPE "calculation_type" RENAME TO "calculation_type_old";
ALTER TYPE "calculation_type_new" RENAME TO "calculation_type";
DROP TYPE "calculation_type_old";
ALTER TABLE "indicator" ALTER COLUMN "calculation_type" SET DEFAULT 'DIRECT_INPUT';
COMMIT;

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
DROP INDEX "indicator_category_id_idx";

-- DropIndex
DROP INDEX "indicator_code_idx";

-- DropIndex
DROP INDEX "indicator_code_key";

-- DropIndex
DROP INDEX "monthly_health_data_indicator_id_facility_id_sub_centre_id__key";

-- AlterTable
ALTER TABLE "data_upload_session" ADD COLUMN     "file_type" VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "indicator" DROP COLUMN "category_id",
DROP COLUMN "code",
DROP COLUMN "data_source",
DROP COLUMN "sort_order",
DROP COLUMN "target_value";

-- AlterTable
ALTER TABLE "monthly_health_data" DROP COLUMN "achievement",
DROP COLUMN "denominator",
DROP COLUMN "numerator",
DROP COLUMN "target_value",
ADD COLUMN     "field_id" INTEGER,
ALTER COLUMN "indicator_id" DROP NOT NULL,
ALTER COLUMN "value" SET NOT NULL;

-- DropTable
DROP TABLE "indicator_category";

-- DropTable
DROP TABLE "indicator_target";

-- CreateTable
CREATE TABLE "field" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "field_type" "field_type" NOT NULL DEFAULT 'NUMBER',
    "data_source" VARCHAR(100) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "field_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "monthly_health_data_field_id_idx" ON "monthly_health_data"("field_id");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_health_data_field_id_indicator_id_facility_id_sub_c_key" ON "monthly_health_data"("field_id", "indicator_id", "facility_id", "sub_centre_id", "report_month");

-- AddForeignKey
ALTER TABLE "monthly_health_data" ADD CONSTRAINT "monthly_health_data_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "field"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_health_data" ADD CONSTRAINT "monthly_health_data_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
