-- AlterEnum
ALTER TYPE "target_type" ADD VALUE 'PERCENTAGE_RANGE';

-- AlterTable
ALTER TABLE "indicator" ADD COLUMN     "source_of_verification" VARCHAR(100);
