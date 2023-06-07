import { Prisma, PrismaClient } from '@prisma/client';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { v4 as uuidV4 } from 'uuid';
import * as dayjs from 'dayjs';
import { FindReservationsDto } from './dtos/find-reservations.dto';
import { formattedReservations } from 'src/utils/utils';

export class ReservationRepository {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  private calculateTotal(
    startsAt: Date,
    endsAt: Date,
    carAdditional: boolean,
  ): number {
    let total = 0;
    const diference = dayjs(endsAt).diff(dayjs(startsAt), 'day');
    const endsAtHour = dayjs(endsAt).hour();
    const endsAtMinute = dayjs(endsAt).minute();
    for (let i = 1; i <= diference; i++) {
      const day = dayjs(startsAt).add(i, 'day').day();
      if (day == 0 || day == 6) {
        total = carAdditional ? total + 170 : total + 150;
      } else {
        total = carAdditional ? total + 135 : total + 120;
      }
    }
    if (endsAtHour >= 16 && endsAtMinute >= 30) {
      const endsAtDay = dayjs(endsAt).day();
      if (endsAtDay == 0 || endsAtDay == 6) {
        total = carAdditional ? total + 170 : total + 150;
      } else {
        total = carAdditional ? total + 135 : total + 120;
      }
    }
    return total;
  }

  async createReservation(
    createReservationDto: CreateReservationDto,
    clientId: string,
  ) {
    const { carAdditional } = createReservationDto;
    const { startsAt, endsAt } = createReservationDto;
    const total = this.calculateTotal(
      dayjs(startsAt).toDate(),
      dayjs(endsAt).toDate(),
      carAdditional,
    );
    const reservation = await this.prismaClient.reservation.create({
      data: {
        id: uuidV4(),
        startsAt: dayjs(startsAt).subtract(3, 'hours').toDate(),
        endsAt: dayjs(endsAt).subtract(3, 'hours').toDate(),
        carAdditional,
        total,
      },
    });
    await this.prismaClient.clientsOnReservations.create({
      data: {
        clientId,
        reservationId: reservation.id,
      },
    });
    return reservation;
  }

  async getReservations(findReservationsDto: FindReservationsDto) {
    const { active } = findReservationsDto;
    const isActive = active.toLowerCase() === 'true' ? true : false;
    /* const query = await this.prismaClient.clientsOnReservations.findMany({
      where: {
        reservation: {
          endsAt: isActive ? { gte: new Date() } : { lte: new Date() },
        },
      },
      include: {
        reservation: true,
        client: {
          include: {
            client: {
              include: {
                reservation: true,
              },
              take: 1,
              skip: 1,
              orderBy: { reservation: { createdAt: 'desc' } },
            },
          },
        },
      },
    }); */

    /* let query = `
    SELECT 
      *,
      (SELECT SUM("Reservation"."total")
      FROM "ClientsOnReservations" 
      LEFT JOIN "Reservation" ON "ClientsOnReservations"."reservationId"="Reservation"."id"
      WHERE "Client"."id"="ClientsOnReservations"."clientId") AS "total_spent",
      (SELECT "Reservation"."total"
      FROM "ClientsOnReservations" 
      LEFT JOIN "Reservation" ON "ClientsOnReservations"."reservationId"="Reservation"."id"
      WHERE "Client"."id"="ClientsOnReservations"."clientId"
      ORDER BY "Reservation"."createdAt" DESC LIMIT 1) AS "last_spent"
    FROM "ClientsOnReservations" 
    LEFT JOIN "Reservation" 
    ON "ClientsOnReservations"."reservationId"="Reservation"."id"
    LEFT JOIN "Client" 
    ON "ClientsOnReservations"."clientId"="Client"."id"
    `; */

    let query;
    if (isActive) {
      query = Prisma.sql`
        SELECT 
          *,
          (SELECT SUM("Reservation"."total")
          FROM "ClientsOnReservations" 
          LEFT JOIN "Reservation" ON "ClientsOnReservations"."reservationId"="Reservation"."id"
          WHERE "Client"."id"="ClientsOnReservations"."clientId") AS "total_spent",
          (SELECT "Reservation"."total"
          FROM "ClientsOnReservations" 
          LEFT JOIN "Reservation" ON "ClientsOnReservations"."reservationId"="Reservation"."id"
          WHERE "Client"."id"="ClientsOnReservations"."clientId"
          ORDER BY "Reservation"."createdAt" DESC LIMIT 1) AS "last_spent"
        FROM "ClientsOnReservations" 
        LEFT JOIN "Reservation" 
        ON "ClientsOnReservations"."reservationId"="Reservation"."id"
        LEFT JOIN "Client" 
        ON "ClientsOnReservations"."clientId"="Client"."id"
        WHERE "Reservation"."endsAt" >= NOW()
      `;
    } else {
      query = Prisma.sql`
        SELECT 
          *,
          (SELECT SUM("Reservation"."total")
          FROM "ClientsOnReservations" 
          LEFT JOIN "Reservation" ON "ClientsOnReservations"."reservationId"="Reservation"."id"
          WHERE "Client"."id"="ClientsOnReservations"."clientId") AS "total_spent",
          (SELECT "Reservation"."total"
          FROM "ClientsOnReservations" 
          LEFT JOIN "Reservation" ON "ClientsOnReservations"."reservationId"="Reservation"."id"
          WHERE "Client"."id"="ClientsOnReservations"."clientId"
          ORDER BY "Reservation"."createdAt" DESC LIMIT 1) AS "last_spent"
        FROM "ClientsOnReservations" 
        LEFT JOIN "Reservation" 
        ON "ClientsOnReservations"."reservationId"="Reservation"."id"
        LEFT JOIN "Client" 
        ON "ClientsOnReservations"."clientId"="Client"."id"
        WHERE "Reservation"."endsAt" <= NOW()
      `;
    }
    const result = await this.prismaClient.$queryRaw(query);
    const reservations = formattedReservations(result);
    return reservations;
  }
}
