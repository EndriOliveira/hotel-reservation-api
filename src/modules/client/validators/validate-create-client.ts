import { z } from 'zod';
import { CreateClientDto } from '../dtos/create-client.dto';

export const validateCreateClient = (body: CreateClientDto) => {
  const Client = z.object({
    name: z.string().trim().min(2).max(255),
    cpf: z
      .string()
      .trim()
      .regex(
        /^([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})$/g,
        'Invalid CPF format',
      )
      .min(11),
    rg: z.string().trim().min(9),
    phone: z.string().trim().min(11),
  });
  return Client.safeParse(body);
};
