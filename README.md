#  Clinic Appointment Booking API

A robust, strictly typed REST API for scheduling healthcare appointments with runtime validation using Zod and TypeScript.

##  Features

-  Full CRUD operations for appointments
-  Runtime validation with Zod schemas
-  TypeScript end-to-end type safety (zero `any` usage)
-  Clean layered architecture (Routes → Controllers → Services)
-  Comprehensive error handling
-  Edge case management (past dates, business hours, etc.)
-  Filtering and search capabilities
- Bonus: Appointment collision detection
- Bonus: Statistics endpoint

## Technology Stack

- **Node.js** (v18+) - Backend runtime
- **TypeScript** - Static typing
- **Express.js** - HTTP routing
- **Zod** - Schema validation
- **UUID** - ID generation

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd clinic-booking-api

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```