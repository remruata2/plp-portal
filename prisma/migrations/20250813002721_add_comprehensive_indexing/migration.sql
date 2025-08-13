/*
  Warnings:

  - You are about to drop the column `remuneration_system_id` on the `indicator_remuneration` table. All the data in the column will be lost.
  - You are about to drop the `data_upload_session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `facility_field_defaults` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `facility_worker_allocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `formula` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `monthly_health_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `performance_calculation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `remuneration_system` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sub_centre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "data_upload_session" DROP CONSTRAINT "data_upload_session_uploaded_by_fkey";

-- DropForeignKey
ALTER TABLE "facility_field_defaults" DROP CONSTRAINT "facility_field_defaults_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "facility_field_defaults" DROP CONSTRAINT "facility_field_defaults_field_id_fkey";

-- DropForeignKey
ALTER TABLE "facility_worker_allocation" DROP CONSTRAINT "facility_worker_allocation_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "facility_worker_allocation" DROP CONSTRAINT "facility_worker_allocation_worker_allocation_config_id_fkey";

-- DropForeignKey
ALTER TABLE "indicator_remuneration" DROP CONSTRAINT "indicator_remuneration_remuneration_system_id_fkey";

-- DropForeignKey
ALTER TABLE "monthly_health_data" DROP CONSTRAINT "monthly_health_data_approved_by_fkey";

-- DropForeignKey
ALTER TABLE "monthly_health_data" DROP CONSTRAINT "monthly_health_data_district_id_fkey";

-- DropForeignKey
ALTER TABLE "monthly_health_data" DROP CONSTRAINT "monthly_health_data_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "monthly_health_data" DROP CONSTRAINT "monthly_health_data_indicator_id_fkey";

-- DropForeignKey
ALTER TABLE "monthly_health_data" DROP CONSTRAINT "monthly_health_data_sub_centre_id_fkey";

-- DropForeignKey
ALTER TABLE "monthly_health_data" DROP CONSTRAINT "monthly_health_data_uploaded_by_fkey";

-- DropForeignKey
ALTER TABLE "performance_calculation" DROP CONSTRAINT "performance_calculation_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "performance_calculation" DROP CONSTRAINT "performance_calculation_indicator_id_fkey";

-- DropForeignKey
ALTER TABLE "performance_calculation" DROP CONSTRAINT "performance_calculation_sub_centre_id_fkey";

-- DropForeignKey
ALTER TABLE "sub_centre" DROP CONSTRAINT "sub_centre_facility_id_fkey";

-- AlterTable
ALTER TABLE "indicator_remuneration" DROP COLUMN "remuneration_system_id";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "created_at" DROP DEFAULT;

-- DropTable
DROP TABLE "data_upload_session";

-- DropTable
DROP TABLE "facility_field_defaults";

-- DropTable
DROP TABLE "facility_worker_allocation";

-- DropTable
DROP TABLE "formula";

-- DropTable
DROP TABLE "monthly_health_data";

-- DropTable
DROP TABLE "performance_calculation";

-- DropTable
DROP TABLE "remuneration_system";

-- DropTable
DROP TABLE "sub_centre";

-- CreateIndex
CREATE INDEX "FacilityRemunerationRecord_status_idx" ON "FacilityRemunerationRecord"("status");

-- CreateIndex
CREATE INDEX "FacilityRemunerationRecord_calculation_date_idx" ON "FacilityRemunerationRecord"("calculation_date");

-- CreateIndex
CREATE INDEX "FacilityRemunerationRecord_facility_id_status_idx" ON "FacilityRemunerationRecord"("facility_id", "status");

-- CreateIndex
CREATE INDEX "facility_is_active_idx" ON "facility"("is_active");

-- CreateIndex
CREATE INDEX "facility_district_id_is_active_idx" ON "facility"("district_id", "is_active");

-- CreateIndex
CREATE INDEX "facility_facility_type_id_is_active_idx" ON "facility"("facility_type_id", "is_active");

-- CreateIndex
CREATE INDEX "facility_field_mapping_field_id_idx" ON "facility_field_mapping"("field_id");

-- CreateIndex
CREATE INDEX "facility_field_mapping_facility_type_id_idx" ON "facility_field_mapping"("facility_type_id");

-- CreateIndex
CREATE INDEX "facility_field_mapping_is_required_idx" ON "facility_field_mapping"("is_required");

-- CreateIndex
CREATE INDEX "facility_field_mapping_display_order_idx" ON "facility_field_mapping"("display_order");

-- CreateIndex
CREATE INDEX "facility_target_facility_id_report_month_idx" ON "facility_target"("facility_id", "report_month");

-- CreateIndex
CREATE INDEX "facility_target_indicator_id_report_month_idx" ON "facility_target"("indicator_id", "report_month");

-- CreateIndex
CREATE INDEX "facility_target_created_at_idx" ON "facility_target"("created_at");

-- CreateIndex
CREATE INDEX "field_field_type_idx" ON "field"("field_type");

-- CreateIndex
CREATE INDEX "field_is_active_idx" ON "field"("is_active");

-- CreateIndex
CREATE INDEX "field_user_type_idx" ON "field"("user_type");

-- CreateIndex
CREATE INDEX "field_field_category_idx" ON "field"("field_category");

-- CreateIndex
CREATE INDEX "field_sort_order_idx" ON "field"("sort_order");

-- CreateIndex
CREATE INDEX "field_value_facility_id_report_month_idx" ON "field_value"("facility_id", "report_month");

-- CreateIndex
CREATE INDEX "field_value_field_id_report_month_idx" ON "field_value"("field_id", "report_month");

-- CreateIndex
CREATE INDEX "field_value_uploaded_by_idx" ON "field_value"("uploaded_by");

-- CreateIndex
CREATE INDEX "field_value_created_at_idx" ON "field_value"("created_at");

-- CreateIndex
CREATE INDEX "field_value_facility_id_field_id_idx" ON "field_value"("facility_id", "field_id");

-- CreateIndex
CREATE INDEX "field_value_report_month_is_override_idx" ON "field_value"("report_month", "is_override");

-- CreateIndex
CREATE INDEX "health_workers_facility_id_idx" ON "health_workers"("facility_id");

-- CreateIndex
CREATE INDEX "health_workers_worker_type_idx" ON "health_workers"("worker_type");

-- CreateIndex
CREATE INDEX "health_workers_is_active_idx" ON "health_workers"("is_active");

-- CreateIndex
CREATE INDEX "indicator_type_idx" ON "indicator"("type");

-- CreateIndex
CREATE INDEX "indicator_formula_type_idx" ON "indicator"("formula_type");

-- CreateIndex
CREATE INDEX "indicator_target_type_idx" ON "indicator"("target_type");

-- CreateIndex
CREATE INDEX "indicator_denominator_field_id_idx" ON "indicator"("denominator_field_id");

-- CreateIndex
CREATE INDEX "indicator_numerator_field_id_idx" ON "indicator"("numerator_field_id");

-- CreateIndex
CREATE INDEX "indicator_target_field_id_idx" ON "indicator"("target_field_id");

-- CreateIndex
CREATE INDEX "indicator_created_at_idx" ON "indicator"("created_at");

-- CreateIndex
CREATE INDEX "indicator_remuneration_facility_type_remuneration_id_idx" ON "indicator_remuneration"("facility_type_remuneration_id");

-- CreateIndex
CREATE INDEX "indicator_remuneration_indicator_id_idx" ON "indicator_remuneration"("indicator_id");

-- CreateIndex
CREATE INDEX "indicator_remuneration_condition_type_idx" ON "indicator_remuneration"("condition_type");

-- CreateIndex
CREATE INDEX "indicator_worker_allocation_indicator_id_idx" ON "indicator_worker_allocation"("indicator_id");

-- CreateIndex
CREATE INDEX "indicator_worker_allocation_worker_type_idx" ON "indicator_worker_allocation"("worker_type");

-- CreateIndex
CREATE INDEX "remuneration_calculations_facility_id_idx" ON "remuneration_calculations"("facility_id");

-- CreateIndex
CREATE INDEX "remuneration_calculations_report_month_idx" ON "remuneration_calculations"("report_month");

-- CreateIndex
CREATE INDEX "remuneration_calculations_calculated_at_idx" ON "remuneration_calculations"("calculated_at");

-- CreateIndex
CREATE INDEX "user_role_is_active_idx" ON "user"("role", "is_active");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_last_login_idx" ON "user"("last_login");

-- CreateIndex
CREATE INDEX "worker_allocation_config_facility_type_id_idx" ON "worker_allocation_config"("facility_type_id");

-- CreateIndex
CREATE INDEX "worker_allocation_config_worker_type_idx" ON "worker_allocation_config"("worker_type");

-- CreateIndex
CREATE INDEX "worker_allocation_config_worker_role_idx" ON "worker_allocation_config"("worker_role");

-- CreateIndex
CREATE INDEX "worker_allocation_config_is_active_idx" ON "worker_allocation_config"("is_active");

-- CreateIndex
CREATE INDEX "worker_allocation_config_facility_type_id_is_active_idx" ON "worker_allocation_config"("facility_type_id", "is_active");
