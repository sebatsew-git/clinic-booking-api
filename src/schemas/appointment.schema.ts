import { z } from 'zod';

// Clinical Department Enum
export const DepartmentEnum = z.enum([
  'GENERAL_PRACTICE',
  'DENTISTRY',
  'CARDIOLOGY',
  'DERMATOLOGY',
  'PEDIATRICS'
]);

export type Department = z.infer<typeof DepartmentEnum>;

// Create appointment schema
export const CreateAppointmentSchema = z.object({
  body: z.object({
    patientName: z
      .string({
        required_error: 'Patient full name is required'
      })
      .trim()
      .min(3, 'Patient name must be at least 3 characters')
      .max(60, 'Patient name must not exceed 60 characters'),

    patientEmail: z
      .string({
        required_error: 'Patient email is required'
      })
      .email('Invalid email address format')
      .transform((val: string): string => val.toLowerCase()),

    patientPhone: z
      .string({
        required_error: 'Patient phone number is required'
      })
      .regex(/^\d{10,14}$/, 'Phone number must be 10-14 digits'),

    department: DepartmentEnum,

    appointmentDate: z
      .string({
        required_error: 'Appointment datetime is required'
      })
      .datetime({
        message: 'Must be a valid ISO-8601 datetime string'
      })
      .refine((val: string): boolean => new Date(val) > new Date(), {
        message: 'Appointment date must be in the future'
      })
      .refine((val: string): boolean => {
        const hour: number = new Date(val).getUTCHours();
        return hour >= 8 && hour < 17;
      }, {
        message: 'Appointments must be scheduled during clinic hours (08:00 - 17:00 UTC)'
      }),

    symptoms: z
      .string({
        required_error: 'Symptoms description is required'
      })
      .min(10, 'Please provide at least 10 characters describing symptoms'),

    isEmergency: z.boolean().default(false)
  })
});

// Update appointment schema - all fields optional
export const UpdateAppointmentSchema = z.object({
  body: CreateAppointmentSchema.shape.body.partial()
});

// Type inference
export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>['body'];
export type UpdateAppointmentInput = z.infer<typeof UpdateAppointmentSchema>['body'];