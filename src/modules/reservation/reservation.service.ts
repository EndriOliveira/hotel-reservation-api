import { Injectable, BadRequestException } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { validateCreateReservation } from './validators/validate-create-reservation';
import { validateCPF } from 'src/utils/validate-cpf';
import { ClientService } from '../client/client.service';
import { FindReservationsDto } from './dtos/find-reservations.dto';

@Injectable()
export class ReservationService {
  constructor(
    private reservationRepository: ReservationRepository,
    private clientService: ClientService,
  ) {}

  async getReservations(query: FindReservationsDto) {
    return await this.reservationRepository.getReservations(query);
  }

  async createReservation(createReservationDto: CreateReservationDto) {
    const validate = validateCreateReservation(createReservationDto);
    if (!validate['success'])
      throw new BadRequestException(validate['error'].issues);
    const { client } = createReservationDto;
    const { cpf, name, phone, rg } = client;
    validateCPF(client.cpf);
    let clientId = '';
    const clientExists = await this.clientService.getClients({
      cpf,
      name,
      phone,
      rg,
    });
    clientId = clientExists.length > 0 ? clientExists[0].id : '';
    if (clientExists.length === 0) {
      const newClient = await this.clientService.createClient(client);
      clientId = newClient.id;
    }
    return await this.reservationRepository.createReservation(
      createReservationDto,
      clientId,
    );
  }
}
