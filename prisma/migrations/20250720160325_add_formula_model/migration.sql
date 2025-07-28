/*
  Warnings:

  - The values [FORMULA_BASED] on the enum `calculation_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `file_type` on the `data_upload_session` table. All the data in the column will be lost.
  - You are about to drop the column `field_id` on the `monthly_health_data` table. All the data in the column will be lost.
  - You are about to drop the `field` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `indicator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[indicator_id,facility_id,sub_centre_id,report_month]` on the table `monthly_health_data` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `indicator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `indicator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_source` to the `indicator` table without a default value. This is not possible if the table is not empty.
  - Made the column `indicator_id` on table `monthly_health_data` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "calculation_type_new" AS ENUM ('DIRECT_INPUT', 'CALCULATED', 'AGGREGATED', 'PERCENTAGE');
ALTER TABLE "indicator" ALTER COLUMN "calculation_type" DROP DEFAULT;
ALTER TABLE "indicator" ALTER COLUMN "calculation_type" TYPE "calculation_type_new" USING ("calculation_type"::text::"calculation_type_new");
ALTER TYPE "calculation_type" RENAME TO "calculation_type_old";
ALTER TYPE "calculation_type_new" RENAME TO "calculation_type";
DROP TYPE "calculation_type_old";
ALTER TABLE "indicator" ALTER COLUMN "calculation_type" SET DEFAULT 'DIRECT_INPUT';
COMMIT;

-- DropForeignKey
ALTER TABLE "monthly_health_data" DROP CONSTRAINT "monthly_health_data_field_id_fkey";

-- DropForeignKey
ALTER TABLE "monthly_health_data" DROP CONSTRAINT "monthly_health_data_indicator_id_fkey";

-- DropIndex
DROP INDEX "monthly_health_data_field_id_idx";

-- DropIndex
DROP INDEX "monthly_health_data_field_id_indicator_id_facility_id_sub_c_key";

-- AlterTable
ALTER TABLE "data_upload_session" DROP COLUMN "file_type";

-- AlterTable
ALTER TABLE "indicator" ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD COLUMN     "code" VARCHAR(50) NOT NULL,
ADD COLUMN     "data_source" VARCHAR(100) NOT NULL,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "target_value" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "monthly_health_data" DROP COLUMN "field_id",
ADD COLUMN     "achievement" DECIMAL(5,2),
ADD COLUMN     "denominator" DECIMAL(15,2),
ADD COLUMN     "numerator" DECIMAL(15,2),
ADD COLUMN     "target_value" DECIMAL(10,2),
ALTER COLUMN "indicator_id" SET NOT NULL,
ALTER COLUMN "value" DROP NOT NULL;

-- DropTable
DROP TABLE "field";

-- DropEnum
DROP TYPE "field_type";

-- CreateTable
CREATE TABLE "indicator_category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "indicator_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicator_target" (
    "id" SERIAL NOT NULL,
    "indicator_id" INTEGER NOT NULL,
    "facility_id" INTEGER,
    "district_id" INTEGER,
    "target_value" DECIMAL(10,2) NOT NULL,
    "target_period" VARCHAR(20) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "indicator_target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formula" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "structure" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "formula_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "indicator_category_name_key" ON "indicator_category"("name");

-- CreateIndex
CREATE INDEX "indicator_target_indicator_id_idx" ON "indicator_target"("indicator_id");

-- CreateIndex
CREATE UNIQUE INDEX "indicator_target_indicator_id_facility_id_target_period_key" ON "indicator_target"("indicator_id", "facility_id", "target_period");

-- CreateIndex
CREATE UNIQUE INDEX "formula_name_key" ON "formula"("name");

-- CreateIndex
CREATE UNIQUE INDEX "indicator_code_key" ON "indicator"("code");

-- CreateIndex
CREATE INDEX "indicator_category_id_idx" ON "indicator"("category_id");

-- CreateIndex
CREATE INDEX "indicator_code_idx" ON "indicator"("code");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_health_data_indicator_id_facility_id_sub_centre_id__key" ON "monthly_health_data"("indicator_id", "facility_id", "sub_centre_id", "report_month");

-- AddForeignKey
ALTER TABLE "indicator" ADD CONSTRAINT "indicator_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "indicator_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_health_data" ADD CONSTRAINT "monthly_health_data_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_target" ADD CONSTRAINT "indicator_target_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_target" ADD CONSTRAINT "indicator_target_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_target" ADD CONSTRAINT "indicator_target_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
