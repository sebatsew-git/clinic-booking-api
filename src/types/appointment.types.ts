import { Department } from '../schemas/appointment.schema';

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  department: Department;
  appointmentDate: string;
  symptoms: string;
  isEmergency: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFilters {
  department?: Department;
  search?: string;
  isEmergency?: boolean;
}

export interface AppointmentStats {
  department: string;
  total: number;
  emergency: number;
  regular: number;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  count?: number;
  errors?: Array<{ field: string; message: string }>;
}