-- AlterTable
ALTER TABLE "indicator" ADD COLUMN     "target_field_id" INTEGER;

-- AddForeignKey
ALTER TABLE "indicator" ADD CONSTRAINT "indicator_target_field_id_fkey" FOREIGN KEY ("target_field_id") REFERENCES "field"("id") ON DELETE SET NULL ON UPDATE CASCADE;
