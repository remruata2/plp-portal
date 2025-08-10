-- DropForeignKey
ALTER TABLE "facility_worker_allocation" DROP CONSTRAINT "facility_worker_allocation_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "worker_allocation_config" DROP CONSTRAINT "worker_allocation_config_facility_type_id_fkey";

-- AlterTable
ALTER TABLE "facility_worker_allocation" ALTER COLUMN "facility_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "worker_allocation_config" ALTER COLUMN "facility_type_id" SET DATA TYPE TEXT,
ALTER COLUMN "worker_type" SET DATA TYPE TEXT,
ALTER COLUMN "worker_role" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "worker_allocation_config" ADD CONSTRAINT "worker_allocation_config_facility_type_id_fkey" FOREIGN KEY ("facility_type_id") REFERENCES "facility_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_worker_allocation" ADD CONSTRAINT "facility_worker_allocation_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "facility_worker_allocation_facility_id_worker_allocation_config" RENAME TO "facility_worker_allocation_facility_id_worker_allocation_co_key";

-- RenameIndex
ALTER INDEX "worker_allocation_config_facility_type_worker_type_worker_role_" RENAME TO "worker_allocation_config_facility_type_id_worker_type_worke_key";
