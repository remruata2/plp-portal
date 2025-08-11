-- CreateTable
CREATE TABLE "facility_remuneration_record" (
    "id" TEXT NOT NULL,
    "facility_id" TEXT NOT NULL,
    "report_month" TEXT NOT NULL,
    "indicator_id" INTEGER,
    "worker_id" INTEGER,
    "actual_value" DOUBLE PRECISION,
    "target_value" DOUBLE PRECISION,
    "percentage_achieved" DOUBLE PRECISION,
    "status" TEXT NOT NULL,
    "incentive_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "max_remuneration" DOUBLE PRECISION,
    "raw_percentage" DOUBLE PRECISION,
    "worker_type" TEXT,
    "worker_role" TEXT,
    "allocated_amount" DOUBLE PRECISION,
    "performance_percentage" DOUBLE PRECISION,
    "calculated_amount" DOUBLE PRECISION,
    "calculation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calculation_version" TEXT NOT NULL DEFAULT '1.0',

    CONSTRAINT "facility_remuneration_record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "facility_remuneration_record_facility_id_report_month_idx" ON "facility_remuneration_record"("facility_id", "report_month");

-- CreateIndex
CREATE INDEX "facility_remuneration_record_report_month_idx" ON "facility_remuneration_record"("report_month");

-- CreateIndex
CREATE INDEX "facility_remuneration_record_indicator_id_idx" ON "facility_remuneration_record"("indicator_id");

-- CreateIndex
CREATE INDEX "facility_remuneration_record_worker_id_idx" ON "facility_remuneration_record"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "facility_remuneration_record_facility_id_report_month_indicat_key" ON "facility_remuneration_record"("facility_id", "report_month", "indicator_id", "worker_id");

-- AddForeignKey
ALTER TABLE "facility_remuneration_record" ADD CONSTRAINT "facility_remuneration_record_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_remuneration_record" ADD CONSTRAINT "facility_remuneration_record_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_remuneration_record" ADD CONSTRAINT "facility_remuneration_record_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "health_workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
