import app from './app';

// Get port from environment or use default
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const HOST: string = process.env.HOST || 'localhost';

// Create server
const server = app.listen(PORT, (): void => {
  console.log('='.repeat(60));
  console.log(' Clinic Appointment Booking API');
  console.log('='.repeat(60));
  console.log(` Server running on http://${HOST}:${PORT}`);
  console.log(` Health check: http://${HOST}:${PORT}/api/health`);
  console.log(` Appointments API: http://${HOST}:${PORT}/api/appointments`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(60));
  console.log(' Server is ready to accept requests');
  console.log('='.repeat(60));
});

// Graceful shutdown handlers
const shutdown = (signal: string): void => {
  console.log(`\n Received ${signal} signal`);
  console.log(' Shutting down gracefully...');
  
  server.close(() => {
    console.log(' Server closed successfully');
    process.exit(0);
  });

  // Force close after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error(' Forcefully shutting down after timeout');
    process.exit(1);
  }, 10000);
};

// Handle termination signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error): void => {
  console.error(' Uncaught Exception:', error);
  shutdown('uncaughtException');
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>): void => {
  console.error(' Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown('unhandledRejection');
});

// Export for testing
export default server;