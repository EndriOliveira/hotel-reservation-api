/*
  Warnings:

  - You are about to drop the column `carAditional` on the `Reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "carAditional",
ADD COLUMN     "carAdditional" BOOLEAN NOT NULL DEFAULT false;
