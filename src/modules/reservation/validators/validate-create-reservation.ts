import { z } from 'zod';
import { CreateReservationDto } from '../dtos/create-reservation.dto';

export const validateCreateReservation = (body: CreateReservationDto) => {
  const Reservation = z.object({
    startsAt: z
      .string()
      .regex(
        /^(19|20)\d{2}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01]) ([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Invalid date format. Use YYYY-MM-DD HH:mm as a valid date format',
      ),
    endsAt: z
      .string()
      .regex(
        /^(19|20)\d{2}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01]) ([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Invalid date format. Use YYYY-MM-DD HH:mm as a valid date format',
      ),
    carAdditional: z.boolean(),
    client: z.object({
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
    }),
  });
  return Reservation.safeParse(body);
};
