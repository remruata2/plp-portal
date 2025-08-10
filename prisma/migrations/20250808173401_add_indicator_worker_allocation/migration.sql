-- AlterTable
ALTER TABLE "indicator_remuneration" ADD COLUMN     "remuneration_system_id" TEXT;

-- CreateTable
CREATE TABLE "remuneration_system" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "remuneration_system_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicator_worker_allocation" (
    "id" TEXT NOT NULL,
    "indicator_id" INTEGER NOT NULL,
    "worker_type" VARCHAR(50) NOT NULL,
    "allocated_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "indicator_worker_allocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "remuneration_system_name_key" ON "remuneration_system"("name");

-- CreateIndex
CREATE UNIQUE INDEX "indicator_worker_allocation_indicator_id_worker_type_key" ON "indicator_worker_allocation"("indicator_id", "worker_type");

-- AddForeignKey
ALTER TABLE "indicator_remuneration" ADD CONSTRAINT "indicator_remuneration_remuneration_system_id_fkey" FOREIGN KEY ("remuneration_system_id") REFERENCES "remuneration_system"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_worker_allocation" ADD CONSTRAINT "indicator_worker_allocation_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
