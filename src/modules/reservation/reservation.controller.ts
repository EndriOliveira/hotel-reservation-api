import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { FindReservationsDto } from './dtos/find-reservations.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Get('/')
  async getReservations(@Query() query: FindReservationsDto) {
    return await this.reservationService.getReservations(query);
  }

  @Post('/')
  async createReservation(@Body() createReservationDto: CreateReservationDto) {
    return await this.reservationService.createReservation(
      createReservationDto,
    );
  }
}
