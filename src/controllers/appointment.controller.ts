import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointment.service';
import {
  CreateAppointmentInput,
  UpdateAppointmentInput
} from '../schemas/appointment.schema';
import { AppointmentFilters, ApiResponse } from '../types/appointment.types';

const appointmentService: AppointmentService = new AppointmentService();

export class AppointmentController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateAppointmentInput = req.body as CreateAppointmentInput;
      const appointment = await appointmentService.create(data);

      const response: ApiResponse = {
        status: 'success',
        message: 'Appointment scheduled successfully',
        data: appointment
      };

      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Failed to create appointment'
        });
      }
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const filters: AppointmentFilters = {
        department: req.query.department as any,
        search: req.query.search as string,
        isEmergency: req.query.isEmergency === 'true' ? true :
          req.query.isEmergency === 'false' ? false : undefined
      };

      const appointments = await appointmentService.findAll(filters);

      const response: ApiResponse = {
        status: 'success',
        count: appointments.length,
        data: appointments
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch appointments'
      });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id }: { id: string } = req.params;
      const appointment = await appointmentService.findById(id);

      if (!appointment) {
        res.status(404).json({
          status: 'error',
          message: `Appointment with ID ${id} not found`
        });
        return;
      }

      const response: ApiResponse = {
        status: 'success',
        data: appointment
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch appointment'
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id }: { id: string } = req.params;
      const data: UpdateAppointmentInput = req.body as UpdateAppointmentInput;

      // Check if update payload is empty
      if (Object.keys(data).length === 0) {
        res.status(400).json({
          status: 'error',
          message: 'No editable fields provided for update'
        });
        return;
      }

      const updated = await appointmentService.update(id, data);

      if (!updated) {
        res.status(404).json({
          status: 'error',
          message: `Appointment with ID ${id} not found`
        });
        return;
      }

      const response: ApiResponse = {
        status: 'success',
        message: 'Appointment updated successfully',
        data: updated
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Failed to update appointment'
        });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id }: { id: string } = req.params;
      const deleted = await appointmentService.delete(id);

      if (!deleted) {
        res.status(404).json({
          status: 'error',
          message: `Appointment with ID ${id} not found`
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete appointment'
      });
    }
  }

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await appointmentService.getStats();

      const response: ApiResponse = {
        status: 'success',
        data: stats
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch statistics'
      });
    }
  }
}