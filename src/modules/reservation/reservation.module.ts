import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { ReservationRepository } from './reservation.repository';
import { ClientService } from '../client/client.service';
import { ClientRepository } from '../client/client.repository';

@Module({
  controllers: [ReservationController],
  providers: [
    ReservationService,
    ReservationRepository,
    ClientService,
    ClientRepository,
  ],
})
export class ReservationModule {}
