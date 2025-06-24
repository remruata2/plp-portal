/*
  Warnings:

  - You are about to drop the column `address` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `bed_capacity` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `staff_count` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `can_have_subcentres` on the `facility_type` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `facility_type` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `facility_type` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `facility_type` table. All the data in the column will be lost.
  - You are about to drop the column `nin` on the `facility_type` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `sub_centre` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `sub_centre` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `sub_centre` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `sub_centre` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `sub_centre` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `sub_centre` table. All the data in the column will be lost.
  - You are about to drop the column `population_served` on the `sub_centre` table. All the data in the column will be lost.
  - You are about to drop the column `staff_count` on the `sub_centre` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[facility_code]` on the table `facility` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nin]` on the table `facility` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facility_code]` on the table `sub_centre` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nin]` on the table `sub_centre` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "facility_code_key";

-- DropIndex
DROP INDEX "facility_type_code_key";

-- DropIndex
DROP INDEX "facility_type_nin_key";

-- DropIndex
DROP INDEX "sub_centre_code_key";

-- AlterTable
ALTER TABLE "facility" DROP COLUMN "address",
DROP COLUMN "bed_capacity",
DROP COLUMN "code",
DROP COLUMN "email",
DROP COLUMN "is_active",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "phone",
DROP COLUMN "staff_count",
ADD COLUMN     "facility_code" VARCHAR(50),
ADD COLUMN     "nin" VARCHAR(50);

-- AlterTable
ALTER TABLE "facility_type" DROP COLUMN "can_have_subcentres",
DROP COLUMN "code",
DROP COLUMN "description",
DROP COLUMN "is_active",
DROP COLUMN "nin";

-- AlterTable
ALTER TABLE "sub_centre" DROP COLUMN "address",
DROP COLUMN "code",
DROP COLUMN "is_active",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "phone",
DROP COLUMN "population_served",
DROP COLUMN "staff_count",
ADD COLUMN     "facility_code" VARCHAR(50),
ADD COLUMN     "nin" VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "facility_facility_code_key" ON "facility"("facility_code");

-- CreateIndex
CREATE UNIQUE INDEX "facility_nin_key" ON "facility"("nin");

-- CreateIndex
CREATE UNIQUE INDEX "sub_centre_facility_code_key" ON "sub_centre"("facility_code");

-- CreateIndex
CREATE UNIQUE INDEX "sub_centre_nin_key" ON "sub_centre"("nin");
