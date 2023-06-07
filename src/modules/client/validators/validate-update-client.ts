import { z } from 'zod';
import { UpdateClientDto } from '../dtos/update-client.dto';

export const validateUpdateClient = (body: UpdateClientDto) => {
  const Client = z.object({
    name: z.string().trim().min(2).max(255).optional(),
    cpf: z
      .string()
      .trim()
      .regex(
        /^([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})$/g,
        'Invalid CPF format',
      )
      .min(11)
      .optional(),
    rg: z.string().trim().min(9).optional(),
    phone: z.string().trim().min(11).optional(),
  });
  return Client.safeParse(body);
};
