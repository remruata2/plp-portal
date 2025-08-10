/*
  Warnings:

  - You are about to drop the column `target_percentage` on the `indicator` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "target_type" AS ENUM ('PERCENTAGE', 'CONSTANT_VALUE', 'BINARY', 'RANGE', 'MINIMUM_THRESHOLD', 'MAXIMUM_THRESHOLD');

-- AlterTable
ALTER TABLE "indicator" DROP COLUMN "target_percentage",
ADD COLUMN     "target_type" "target_type" NOT NULL DEFAULT 'PERCENTAGE',
ADD COLUMN     "target_value" VARCHAR(100);
