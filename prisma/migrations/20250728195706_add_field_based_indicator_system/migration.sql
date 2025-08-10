/*
  Warnings:

  - You are about to alter the column `description` on the `field` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - Added the required column `field_type` to the `field` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_type` to the `field` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'FACILITY');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('CONSTANT', 'FACILITY_SPECIFIC', 'MONTHLY_COUNT', 'BINARY', 'PERCENTAGE', 'CALCULATED', 'INDICATOR_REFERENCE', 'FACILITY_TYPE_SPECIFIC');

-- CreateEnum
CREATE TYPE "ValidationRule" AS ENUM ('REQUIRED', 'POSITIVE_NUMBER', 'PERCENTAGE_RANGE', 'DATE_RANGE', 'CUSTOM_FORMULA', 'BINARY_ONLY', 'MIN_VALUE', 'MAX_VALUE');

-- CreateEnum
CREATE TYPE "formula_type" AS ENUM ('RANGE_BASED', 'PERCENTAGE_CAP', 'BINARY', 'THRESHOLD_BONUS', 'MINIMUM_THRESHOLD', 'PERCENTAGE_RANGE');

-- AlterTable
ALTER TABLE "field" ADD COLUMN     "calculation_formula" VARCHAR(500),
ADD COLUMN     "default_value" VARCHAR(100),
ADD COLUMN     "facility_type_targets" JSONB,
ADD COLUMN     "field_type" "FieldType" NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "user_type" "UserType" NOT NULL,
ADD COLUMN     "validation_rules" JSONB,
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "indicator" ADD COLUMN     "applicable_facility_types" JSONB,
ADD COLUMN     "conditions" VARCHAR(1000),
ADD COLUMN     "denominator_field_id" INTEGER,
ADD COLUMN     "denominator_label" VARCHAR(200),
ADD COLUMN     "formula_config" JSONB,
ADD COLUMN     "formula_type" "formula_type" NOT NULL DEFAULT 'RANGE_BASED',
ADD COLUMN     "numerator_field_id" INTEGER,
ADD COLUMN     "numerator_label" VARCHAR(200),
ADD COLUMN     "target_formula" VARCHAR(500),
ADD COLUMN     "target_percentage" DECIMAL(5,2);

-- CreateTable
CREATE TABLE "field_value" (
    "id" SERIAL NOT NULL,
    "field_id" INTEGER NOT NULL,
    "facility_id" INTEGER,
    "report_month" VARCHAR(7) NOT NULL,
    "string_value" VARCHAR(500),
    "numeric_value" DECIMAL(15,2),
    "boolean_value" BOOLEAN,
    "json_value" JSONB,
    "uploaded_by" INTEGER NOT NULL,
    "remarks" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "field_value_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facility_type_remuneration" (
    "id" SERIAL NOT NULL,
    "facility_type_id" INTEGER NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "effective_from" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effective_to" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "facility_type_remuneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicator_remuneration" (
    "id" SERIAL NOT NULL,
    "facility_type_remuneration_id" INTEGER NOT NULL,
    "indicator_id" INTEGER NOT NULL,
    "base_amount" DECIMAL(10,2) NOT NULL,
    "conditional_amount" DECIMAL(10,2),
    "condition_type" VARCHAR(50),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "indicator_remuneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_calculation" (
    "id" SERIAL NOT NULL,
    "facility_id" INTEGER,
    "sub_centre_id" INTEGER,
    "indicator_id" INTEGER NOT NULL,
    "report_month" VARCHAR(7) NOT NULL,
    "numerator" DECIMAL(15,2),
    "denominator" DECIMAL(15,2),
    "achievement" DECIMAL(5,2),
    "target_value" DECIMAL(10,2),
    "remuneration_amount" DECIMAL(10,2),
    "calculated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "performance_calculation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicator_configuration" (
    "id" SERIAL NOT NULL,
    "indicator_id" INTEGER NOT NULL,
    "facility_type_id" INTEGER,
    "facility_id" INTEGER,
    "numerator_label" VARCHAR(200) NOT NULL,
    "denominator_label" VARCHAR(200) NOT NULL,
    "target_value" DECIMAL(15,2),
    "target_formula" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "indicator_configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facility_target" (
    "id" SERIAL NOT NULL,
    "facility_id" INTEGER NOT NULL,
    "indicator_id" INTEGER NOT NULL,
    "report_month" VARCHAR(7) NOT NULL,
    "target_value" DECIMAL(15,2) NOT NULL,
    "numerator_label" VARCHAR(200) NOT NULL,
    "denominator_label" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "facility_target_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "field_value_field_id_facility_id_report_month_key" ON "field_value"("field_id", "facility_id", "report_month");

-- CreateIndex
CREATE UNIQUE INDEX "facility_type_remuneration_facility_type_id_key" ON "facility_type_remuneration"("facility_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "indicator_remuneration_facility_type_remuneration_id_indica_key" ON "indicator_remuneration"("facility_type_remuneration_id", "indicator_id");

-- CreateIndex
CREATE UNIQUE INDEX "performance_calculation_facility_id_sub_centre_id_indicator_key" ON "performance_calculation"("facility_id", "sub_centre_id", "indicator_id", "report_month");

-- CreateIndex
CREATE UNIQUE INDEX "indicator_configuration_indicator_id_facility_type_id_key" ON "indicator_configuration"("indicator_id", "facility_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "facility_target_facility_id_indicator_id_report_month_key" ON "facility_target"("facility_id", "indicator_id", "report_month");

-- AddForeignKey
ALTER TABLE "indicator" ADD CONSTRAINT "indicator_numerator_field_id_fkey" FOREIGN KEY ("numerator_field_id") REFERENCES "field"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator" ADD CONSTRAINT "indicator_denominator_field_id_fkey" FOREIGN KEY ("denominator_field_id") REFERENCES "field"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_value" ADD CONSTRAINT "field_value_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_value" ADD CONSTRAINT "field_value_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_value" ADD CONSTRAINT "field_value_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_type_remuneration" ADD CONSTRAINT "facility_type_remuneration_facility_type_id_fkey" FOREIGN KEY ("facility_type_id") REFERENCES "facility_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_remuneration" ADD CONSTRAINT "indicator_remuneration_facility_type_remuneration_id_fkey" FOREIGN KEY ("facility_type_remuneration_id") REFERENCES "facility_type_remuneration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_remuneration" ADD CONSTRAINT "indicator_remuneration_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_calculation" ADD CONSTRAINT "performance_calculation_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_calculation" ADD CONSTRAINT "performance_calculation_sub_centre_id_fkey" FOREIGN KEY ("sub_centre_id") REFERENCES "sub_centre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_calculation" ADD CONSTRAINT "performance_calculation_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_configuration" ADD CONSTRAINT "indicator_configuration_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_configuration" ADD CONSTRAINT "indicator_configuration_facility_type_id_fkey" FOREIGN KEY ("facility_type_id") REFERENCES "facility_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_configuration" ADD CONSTRAINT "indicator_configuration_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_target" ADD CONSTRAINT "facility_target_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_target" ADD CONSTRAINT "facility_target_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
