export class CreateReservationDto {
  startsAt: string;
  endsAt: string;
  carAdditional: boolean;
  client: {
    name: string;
    cpf: string;
    rg: string;
    phone: string;
  };
}
