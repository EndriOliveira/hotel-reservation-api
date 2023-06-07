/*
  Warnings:

  - You are about to drop the column `clientId` on the `Reservation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_clientId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "clientId";

-- CreateTable
CREATE TABLE "ClientsOnReservations" (
    "id" VARCHAR(255) NOT NULL,
    "clientId" VARCHAR(255),
    "reservationId" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientsOnReservations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientsOnReservations" ADD CONSTRAINT "ClientsOnReservations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientsOnReservations" ADD CONSTRAINT "ClientsOnReservations_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
