-- CreateTable
CREATE TABLE "remuneration_calculations" (
    "id" SERIAL NOT NULL,
    "facility_id" TEXT NOT NULL,
    "report_month" VARCHAR(7) NOT NULL,
    "performance_percentage" DECIMAL(5,2) NOT NULL,
    "facility_remuneration" DECIMAL(10,2) NOT NULL,
    "total_worker_remuneration" DECIMAL(10,2) NOT NULL,
    "total_remuneration" DECIMAL(10,2) NOT NULL,
    "health_workers_count" INTEGER NOT NULL DEFAULT 0,
    "asha_workers_count" INTEGER NOT NULL DEFAULT 0,
    "calculated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "remuneration_calculations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_remunerations" (
    "id" SERIAL NOT NULL,
    "health_worker_id" INTEGER NOT NULL,
    "report_month" VARCHAR(7) NOT NULL,
    "allocated_amount" DECIMAL(10,2) NOT NULL,
    "performance_percentage" DECIMAL(5,2) NOT NULL,
    "calculated_amount" DECIMAL(10,2) NOT NULL,
    "calculated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "worker_remunerations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "remuneration_calculations_facility_id_report_month_key" ON "remuneration_calculations"("facility_id", "report_month");

-- CreateIndex
CREATE UNIQUE INDEX "worker_remunerations_health_worker_id_report_month_key" ON "worker_remunerations"("health_worker_id", "report_month");

-- AddForeignKey
ALTER TABLE "remuneration_calculations" ADD CONSTRAINT "remuneration_calculations_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_remunerations" ADD CONSTRAINT "worker_remunerations_health_worker_id_fkey" FOREIGN KEY ("health_worker_id") REFERENCES "health_workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
