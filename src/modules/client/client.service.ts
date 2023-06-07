import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { CreateClientDto } from './dtos/create-client.dto';
import { validateCPF } from 'src/utils/validate-cpf';
import { validateCreateClient } from './validators/validate-create-client';
import { FindClientsQueryDto } from './dtos/find-clients.dto';
import { UpdateClientDto } from './dtos/update-client.dto';
import { validateUpdateClient } from './validators/validate-update-client';

@Injectable()
export class ClientService {
  constructor(private clientRepository: ClientRepository) {}

  async createClient(createClientDto: CreateClientDto) {
    const validate = validateCreateClient(createClientDto);
    if (!validate['success'])
      throw new BadRequestException(validate['error'].issues);
    const { cpf } = createClientDto;
    validateCPF(cpf);
    return await this.clientRepository.createClient(createClientDto);
  }

  async getClients(findClientsQuery: FindClientsQueryDto) {
    return await this.clientRepository.getClients(findClientsQuery);
  }

  async getClientById(id: string) {
    return await this.clientRepository.getClientById(id);
  }

  async updateClient(id: string, updateClientDto: UpdateClientDto) {
    const validate = validateUpdateClient(updateClientDto);
    if (!validate['success'])
      throw new BadRequestException(validate['error'].issues);
    const { cpf } = updateClientDto;
    if (cpf) validateCPF(cpf);
    return await this.clientRepository.updateClient(id, updateClientDto);
  }

  async deleteClient(id: string) {
    return await this.clientRepository.deleteClient(id);
  }
}
