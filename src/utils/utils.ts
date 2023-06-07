import * as dayjs from 'dayjs';

export const formatCpf = (cpf: string): string => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatPhone = (phone: string): string => {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export const formatRg = (rg: string): string => {
  return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
};

export const formattedReservations = (reservations: any): any => {
  return reservations.map((reservation: any) => ({
    id: reservation.reservationId,
    startsAt: dayjs(reservation.startsAt).format('DD/MM/YYYY HH:mm'),
    endsAt: dayjs(reservation.endsAt).format('DD/MM/YYYY HH:mm'),
    carAdditional: reservation.carAdditional,
    total: reservation.total,
    client: {
      id: reservation.clientId,
      name: reservation.name,
      cpf: reservation.cpf,
      rg: reservation.rg,
      phone: reservation.phone,
      lastSpent: reservation.last_spent,
      totalSpent: reservation.total_spent,
    },
  }));
};
