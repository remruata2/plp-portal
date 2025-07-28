-- CreateEnum
CREATE TYPE "calculation_type" AS ENUM ('DIRECT_INPUT', 'CALCULATED', 'AGGREGATED', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "data_quality" AS ENUM ('PENDING', 'VALIDATED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "upload_status" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

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
CREATE TABLE "indicator" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "unit" VARCHAR(20) NOT NULL,
    "target_value" DECIMAL(10,2),
    "calculation_type" "calculation_type" NOT NULL DEFAULT 'DIRECT_INPUT',
    "formula" TEXT,
    "category_id" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "data_source" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "indicator_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "monthly_health_data" (
    "id" SERIAL NOT NULL,
    "indicator_id" INTEGER NOT NULL,
    "facility_id" INTEGER,
    "sub_centre_id" INTEGER,
    "district_id" INTEGER NOT NULL,
    "report_month" VARCHAR(7) NOT NULL,
    "value" DECIMAL(15,2),
    "numerator" DECIMAL(15,2),
    "denominator" DECIMAL(15,2),
    "target_value" DECIMAL(10,2),
    "achievement" DECIMAL(5,2),
    "data_quality" "data_quality" NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "uploaded_by" INTEGER NOT NULL,
    "approved_by" INTEGER,
    "approved_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "monthly_health_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_upload_session" (
    "id" SERIAL NOT NULL,
    "file_name" VARCHAR(200) NOT NULL,
    "report_month" VARCHAR(7) NOT NULL,
    "total_records" INTEGER NOT NULL,
    "success_count" INTEGER NOT NULL DEFAULT 0,
    "error_count" INTEGER NOT NULL DEFAULT 0,
    "status" "upload_status" NOT NULL DEFAULT 'PROCESSING',
    "upload_summary" JSONB,
    "uploaded_by" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "data_upload_session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "indicator_category_name_key" ON "indicator_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "indicator_code_key" ON "indicator"("code");

-- CreateIndex
CREATE INDEX "indicator_category_id_idx" ON "indicator"("category_id");

-- CreateIndex
CREATE INDEX "indicator_code_idx" ON "indicator"("code");

-- CreateIndex
CREATE INDEX "indicator_target_indicator_id_idx" ON "indicator_target"("indicator_id");

-- CreateIndex
CREATE UNIQUE INDEX "indicator_target_indicator_id_facility_id_target_period_key" ON "indicator_target"("indicator_id", "facility_id", "target_period");

-- CreateIndex
CREATE INDEX "monthly_health_data_report_month_idx" ON "monthly_health_data"("report_month");

-- CreateIndex
CREATE INDEX "monthly_health_data_indicator_id_idx" ON "monthly_health_data"("indicator_id");

-- CreateIndex
CREATE INDEX "monthly_health_data_district_id_idx" ON "monthly_health_data"("district_id");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_health_data_indicator_id_facility_id_sub_centre_id__key" ON "monthly_health_data"("indicator_id", "facility_id", "sub_centre_id", "report_month");

-- AddForeignKey
ALTER TABLE "indicator" ADD CONSTRAINT "indicator_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "indicator_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_target" ADD CONSTRAINT "indicator_target_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_target" ADD CONSTRAINT "indicator_target_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_target" ADD CONSTRAINT "indicator_target_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_health_data" ADD CONSTRAINT "monthly_health_data_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_health_data" ADD CONSTRAINT "monthly_health_data_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_health_data" ADD CONSTRAINT "monthly_health_data_sub_centre_id_fkey" FOREIGN KEY ("sub_centre_id") REFERENCES "sub_centre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_health_data" ADD CONSTRAINT "monthly_health_data_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_health_data" ADD CONSTRAINT "monthly_health_data_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_health_data" ADD CONSTRAINT "monthly_health_data_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_upload_session" ADD CONSTRAINT "data_upload_session_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
