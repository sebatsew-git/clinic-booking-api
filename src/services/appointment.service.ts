import { AppointmentInput, Appointment } from '../types/appointment.types';

const appointments: Appointment[] = [];

export const getAppointmentsService = async (): Promise<Appointment[]> => {
  return appointments;
};

export const createAppointmentService = async (input: AppointmentInput): Promise<Appointment> => {
  const appointment: Appointment = {
    id: String(appointments.length + 1),
    ...input,
    createdAt: new Date().toISOString(),
  };

  appointments.push(appointment);
  return appointment;
};
