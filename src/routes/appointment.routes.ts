import { Router } from 'express';
import {
  CreateAppointmentSchema,
  UpdateAppointmentSchema
} from '../schemas/appointment.schema';
import { validateRequest } from '../middlewares/validate.middleware';
import { AppointmentController } from '../controllers/appointment.controller';

const router: Router = Router();
const controller: AppointmentController = new AppointmentController();

// POST /api/appointments - Create new appointment
router.post(
  '/',
  validateRequest(CreateAppointmentSchema),
  controller.create.bind(controller)
);

// GET /api/appointments - List all appointments with filters
router.get('/', controller.findAll.bind(controller));

// GET /api/appointments/:id - Get single appointment
router.get('/:id', controller.findById.bind(controller));

// PATCH /api/appointments/:id - Update appointment
router.patch(
  '/:id',
  validateRequest(UpdateAppointmentSchema),
  controller.update.bind(controller)
);

// DELETE /api/appointments/:id - Delete appointment
router.delete('/:id', controller.delete.bind(controller));

// GET /api/appointments/stats/overview - Statistics (bonus)
router.get('/stats/overview', controller.getStats.bind(controller));

export default router;