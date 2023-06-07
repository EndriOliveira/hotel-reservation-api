-- DropForeignKey
ALTER TABLE "ClientsOnReservations" DROP CONSTRAINT "ClientsOnReservations_reservationId_fkey";

-- AddForeignKey
ALTER TABLE "ClientsOnReservations" ADD CONSTRAINT "ClientsOnReservations_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
