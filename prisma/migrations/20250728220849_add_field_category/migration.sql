-- CreateEnum
CREATE TYPE "field_category" AS ENUM ('DATA_FIELD', 'TARGET_FIELD');

-- AlterTable
ALTER TABLE "field" ADD COLUMN     "field_category" "field_category" NOT NULL DEFAULT 'DATA_FIELD';
