import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { FindClientsQueryDto } from './dtos/find-clients.dto';
import { UpdateClientDto } from './dtos/update-client.dto';

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Post('/')
  async createClient(@Body() createClientDto: CreateClientDto) {
    return await this.clientService.createClient(createClientDto);
  }

  @Get('/')
  async getClients(@Query() query: FindClientsQueryDto) {
    return await this.clientService.getClients(query);
  }

  @Get('/:userId')
  async getClientById(@Param('userId') id: string) {
    return await this.clientService.getClientById(id);
  }

  @Put('/:userId')
  async updateClient(
    @Param('userId') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return await this.clientService.updateClient(id, updateClientDto);
  }

  @Delete('/:userId')
  async deleteClient(@Param('userId') id: string) {
    return await this.clientService.deleteClient(id);
  }
}
