import { PrismaClient, Client } from '@prisma/client';
import { CreateClientDto } from './dtos/create-client.dto';
import { v4 as uuidV4 } from 'uuid';
import { formatCpf, formatPhone, formatRg } from '../../utils/utils';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FindClientsQueryDto } from './dtos/find-clients.dto';
import { UpdateClientDto } from './dtos/update-client.dto';

export class ClientRepository {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    const { name, phone, cpf, rg } = createClientDto;
    const clientExists = await this.prismaClient.client.findFirst({
      where: { OR: [{ cpf: formatCpf(cpf) }, { rg: formatRg(rg) }] },
    });
    if (clientExists) throw new ConflictException('CPF/RG are already in use');
    try {
      return await this.prismaClient.client.create({
        data: {
          id: uuidV4(),
          cpf: formatCpf(cpf),
          name,
          phone: formatPhone(phone),
          rg: formatRg(rg),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getClients(findClientsQuery: FindClientsQueryDto) {
    let { name, cpf, rg, phone } = findClientsQuery;

    name = name ? name : '';
    cpf = cpf ? formatCpf(cpf) : '';
    rg = rg ? formatRg(rg) : '';
    phone = phone ? formatPhone(phone) : '';

    try {
      return await this.prismaClient.client.findMany({
        select: {
          id: true,
          name: true,
          cpf: true,
          rg: true,
          phone: true,
        },
        where: {
          AND: [
            { name: { contains: name, mode: 'insensitive' } },
            { cpf: { contains: cpf, mode: 'insensitive' } },
            { rg: { contains: rg, mode: 'insensitive' } },
            { phone: { contains: phone, mode: 'insensitive' } },
          ],
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getClientById(id: string) {
    try {
      return await this.prismaClient.client.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          cpf: true,
          rg: true,
          phone: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async updateClient(id: string, updateClientDto: UpdateClientDto) {
    const { name, phone, cpf, rg } = updateClientDto;
    const clientExists = await this.prismaClient.client.findUnique({
      where: { id },
    });
    if (!clientExists) throw new NotFoundException('Client does not exists');
    const cpfOrRgExists = await this.prismaClient.client.findFirst({
      where: { OR: [{ cpf: formatCpf(cpf) }, { rg: formatRg(rg) }] },
    });
    if (cpfOrRgExists && cpfOrRgExists.id !== id)
      throw new ConflictException('CPF/RG are already in use');
    try {
      return await this.prismaClient.client.update({
        where: { id },
        data: {
          cpf: cpf ? formatCpf(cpf) : clientExists.cpf,
          name: name ? name : clientExists.name,
          phone: phone ? formatPhone(phone) : clientExists.phone,
          rg: rg ? formatRg(rg) : clientExists.rg,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async deleteClient(id: string) {
    const clientExists = await this.prismaClient.client.findUnique({
      where: { id },
    });
    if (!clientExists) throw new NotFoundException('Client does not exists');
    try {
      await this.prismaClient.client.delete({ where: { id } });
      return { message: 'Client deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
