-- CreateTable
CREATE TABLE "worker_allocation_config" (
    "id" SERIAL NOT NULL,
    "facility_type_id" VARCHAR NOT NULL,
    "worker_type" VARCHAR NOT NULL,
    "worker_role" VARCHAR NOT NULL,
    "max_count" INTEGER NOT NULL DEFAULT 1,
    "allocated_amount" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "worker_allocation_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facility_worker_allocation" (
    "id" SERIAL NOT NULL,
    "facility_id" VARCHAR NOT NULL,
    "worker_allocation_config_id" INTEGER NOT NULL,
    "worker_count" INTEGER NOT NULL DEFAULT 1,
    "total_allocated_amount" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "facility_worker_allocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "worker_allocation_config_facility_type_worker_type_worker_role_key" ON "worker_allocation_config"("facility_type_id", "worker_type", "worker_role");

-- CreateIndex
CREATE UNIQUE INDEX "facility_worker_allocation_facility_id_worker_allocation_config_id_key" ON "facility_worker_allocation"("facility_id", "worker_allocation_config_id");

-- AddForeignKey
ALTER TABLE "worker_allocation_config" ADD CONSTRAINT "worker_allocation_config_facility_type_id_fkey" FOREIGN KEY ("facility_type_id") REFERENCES "facility_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_worker_allocation" ADD CONSTRAINT "facility_worker_allocation_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_worker_allocation" ADD CONSTRAINT "facility_worker_allocation_worker_allocation_config_id_fkey" FOREIGN KEY ("worker_allocation_config_id") REFERENCES "worker_allocation_config"("id") ON DELETE CASCADE ON UPDATE CASCADE; 