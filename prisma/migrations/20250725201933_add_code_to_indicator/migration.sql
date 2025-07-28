/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `indicator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `indicator` table without a default value. This is not possible if the table is not empty.

*/

-- First, delete existing indicators to allow adding the code column
DELETE FROM "indicator";

-- AlterTable
ALTER TABLE "indicator" ADD COLUMN     "code" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "indicator_code_key" ON "indicator"("code");
