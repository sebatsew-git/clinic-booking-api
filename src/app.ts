import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import appointmentRoutes from './routes/appointment.routes';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware';

// Create Express application
const app: Express = express();

// Middleware configuration
app.use(helmet()); // Security headers
app.use(cors()); // CORS support
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req: Request, res: Response): void => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'Clinic Appointment Booking API',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/appointments', appointmentRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    message: 'Welcome to Clinic Appointment Booking API',
    documentation: 'See README.md for API documentation',
    endpoints: {
      health: 'GET /health',
      appointments: 'GET /api/appointments',
      createAppointment: 'POST /api/appointments',
      getAppointment: 'GET /api/appointments/:id',
      updateAppointment: 'PATCH /api/appointments/:id',
      deleteAppointment: 'DELETE /api/appointments/:id',
      stats: 'GET /api/appointments/stats/overview'
    }
  });
});

// 404 handler for unknown routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;