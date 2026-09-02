

// In-memory storage
let appointments: Appointment[] = [];

export class AppointmentService {
  async create(data: CreateAppointmentInput): Promise<Appointment> {
    // Check for collisions
    this.checkForCollision(data.department, data.appointmentDate);

    const now: string = new Date().toISOString();
    const newAppointment: Appointment = {
      id: uuidv4(),
      ...data,
      createdAt: now,
      updatedAt: now
    };

    appointments.push(newAppointment);
    return newAppointment;
  }

  async findAll(filters?: AppointmentFilters): Promise<Appointment[]> {
    let filtered: Appointment[] = [...appointments];

    if (filters) {
      if (filters.department) {
        filtered = filtered.filter(
          (app: Appointment): boolean => app.department === filters.department
        );
      }

      if (filters.isEmergency !== undefined) {
        filtered = filtered.filter(
          (app: Appointment): boolean => app.isEmergency === filters.isEmergency
        );
      }

      if (filters.search) {
        const searchLower: string = filters.search.toLowerCase();
        filtered = filtered.filter(
          (app: Appointment): boolean =>
            app.patientName.toLowerCase().includes(searchLower) ||
            app.symptoms.toLowerCase().includes(searchLower)
        );
      }
    }

    return filtered.sort(
      (a: Appointment, b: Appointment): number =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime()
    );
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment: Appointment | undefined = appointments.find(
      (app: Appointment): boolean => app.id === id
    );
    return appointment || null;
  }

  async update(
    id: string,
    data: UpdateAppointmentInput
  ): Promise<Appointment | null> {
    const index: number = appointments.findIndex(
      (app: Appointment): boolean => app.id === id
    );

    if (index === -1) {
      return null;
    }

    const currentAppointment: Appointment = appointments[index];

    // Check for collisions if date or department is being updated
    if (data.department && data.appointmentDate) {
      this.checkForCollision(data.department, data.appointmentDate, id);
    } else if (data.department && !data.appointmentDate) {
      this.checkForCollision(
        data.department,
        currentAppointment.appointmentDate,
        id
      );
    } else if (!data.department && data.appointmentDate) {
      this.checkForCollision(
        currentAppointment.department,
        data.appointmentDate,
        id
      );
    }

    const updatedAppointment: Appointment = {
      ...currentAppointment,
      ...data,
      updatedAt: new Date().toISOString()
    };

    appointments[index] = updatedAppointment;
    return updatedAppointment;
  }

  async delete(id: string): Promise<boolean> {
    const initialLength: number = appointments.length;
    appointments = appointments.filter((app: Appointment): boolean => app.id !== id);
    return appointments.length < initialLength;
  }

  async getStats(): Promise<AppointmentStats[]> {
    const departments: string[] = [
      'GENERAL_PRACTICE',
      'DENTISTRY',
      'CARDIOLOGY',
      'DERMATOLOGY',
      'PEDIATRICS'
    ];

    return departments.map((dept: string): AppointmentStats => {
      const deptAppointments: Appointment[] = appointments.filter(
        (app: Appointment): boolean => app.department === dept
      );
      const emergency: number = deptAppointments.filter(
        (app: Appointment): boolean => app.isEmergency
      ).length;

      return {
        department: dept,
        total: deptAppointments.length,
        emergency,
        regular: deptAppointments.length - emergency
      };
    });
  }

  private checkForCollision(
    department: string,
    appointmentDate: string,
    excludeId?: string
  ): void {
    const appointmentHour: number = new Date(appointmentDate).getUTCHours();
    const appointmentDateStr: string = new Date(appointmentDate).toDateString();

    const collision: boolean = appointments.some((app: Appointment): boolean => {
      const appHour: number = new Date(app.appointmentDate).getUTCHours();
      const appDateStr: string = new Date(app.appointmentDate).toDateString();

      return (
        app.id !== excludeId &&
        app.department === department &&
        appDateStr === appointmentDateStr &&
        appHour === appointmentHour
      );
    });

    if (collision) {
      throw new Error(
        'Another appointment already exists in this department at the same hour'
      );
    }
  }

  // Helper methods for testing
  clearAll(): void {
    appointments = [];
  }

  count(): number {
    return appointments.length;
  }
}