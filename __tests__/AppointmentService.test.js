import { AppointmentService } from '../backend/AppointmentService.js';

describe('AppointmentService', () => {
  let appointmentService;

  beforeEach(() => {
    appointmentService = new AppointmentService();
  });

  describe('createAppointment', () => {
    const validAppointmentData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '06-12345678',
      legalArea: 'familierecht',
      date: '2025-12-31',
      time: '10:00',
      type: 'kantoor',
      description: 'Advies over echtscheiding'
    };

    it('should create an appointment successfully with valid data', async () => {
      const result = await appointmentService.createAppointment(validAppointmentData);

      expect(result).toEqual({
        id: 1,
        ...validAppointmentData,
        createdAt: expect.any(String),
        status: 'scheduled'
      });
      expect(new Date(result.createdAt)).toBeInstanceOf(Date);
    });

    it('should assign incremental IDs to appointments', async () => {
      const appointment1 = await appointmentService.createAppointment(validAppointmentData);
      const appointmentData2 = { ...validAppointmentData, time: '11:00' };
      const appointment2 = await appointmentService.createAppointment(appointmentData2);

      expect(appointment1.id).toBe(1);
      expect(appointment2.id).toBe(2);
    });

    it('should throw error when required fields are missing', async () => {
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'legalArea', 'date', 'time', 'type', 'description'];
      
      for (const field of requiredFields) {
        const invalidData = { ...validAppointmentData };
        delete invalidData[field];

        await expect(appointmentService.createAppointment(invalidData))
          .rejects
          .toThrow(`Missing required field: ${field}`);
      }
    });

    it('should throw error when email is invalid', async () => {
      const invalidEmailData = {
        ...validAppointmentData,
        email: 'invalid-email'
      };

      await expect(appointmentService.createAppointment(invalidEmailData))
        .rejects
        .toThrow('Invalid email format');
    });

    it('should throw error when date is invalid', async () => {
      const invalidDateData = {
        ...validAppointmentData,
        date: '2023-01-01' // Past date
      };

      await expect(appointmentService.createAppointment(invalidDateData))
        .rejects
        .toThrow('Invalid date format. Use YYYY-MM-DD');
    });

    it('should throw error when time is invalid', async () => {
      const invalidTimeData = {
        ...validAppointmentData,
        time: '25:00' // Invalid time
      };

      await expect(appointmentService.createAppointment(invalidTimeData))
        .rejects
        .toThrow('Invalid time format. Use HH:MM');
    });

    it('should throw error when appointment type is invalid', async () => {
      const invalidTypeData = {
        ...validAppointmentData,
        type: 'invalid-type'
      };

      await expect(appointmentService.createAppointment(invalidTypeData))
        .rejects
        .toThrow('Invalid appointment type. Use "kantoor" or "videobellen"');
    });

    it('should throw error when legal area is invalid', async () => {
      const invalidLegalAreaData = {
        ...validAppointmentData,
        legalArea: 'invalid-area'
      };

      await expect(appointmentService.createAppointment(invalidLegalAreaData))
        .rejects
        .toThrow('Invalid legal area');
    });

    it('should throw error when time slot is already booked', async () => {
      await appointmentService.createAppointment(validAppointmentData);

      const duplicateAppointment = {
        ...validAppointmentData,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com'
      };

      await expect(appointmentService.createAppointment(duplicateAppointment))
        .rejects
        .toThrow('This time slot is already booked');
    });
  });

  describe('getAllAppointments', () => {
    it('should return empty array when no appointments exist', async () => {
      const result = await appointmentService.getAllAppointments();
      expect(result).toEqual([]);
    });

    it('should return all appointments', async () => {
      const appointmentData1 = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '06-12345678',
        legalArea: 'familierecht',
        date: '2025-12-31',
        time: '10:00',
        type: 'kantoor',
        description: 'Test appointment 1'
      };
      const appointmentData2 = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '06-87654321',
        legalArea: 'arbeidsrecht',
        date: '2025-12-31',
        time: '11:00',
        type: 'videobellen',
        description: 'Test appointment 2'
      };

      const appointment1 = await appointmentService.createAppointment(appointmentData1);
      const appointment2 = await appointmentService.createAppointment(appointmentData2);

      const result = await appointmentService.getAllAppointments();
      expect(result).toHaveLength(2);
      expect(result).toContain(appointment1);
      expect(result).toContain(appointment2);
    });
  });

  describe('getAppointmentById', () => {
    it('should return appointment when it exists', async () => {
      const appointmentData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '06-12345678',
        legalArea: 'familierecht',
        date: '2025-12-31',
        time: '10:00',
        type: 'kantoor',
        description: 'Test appointment'
      };

      const createdAppointment = await appointmentService.createAppointment(appointmentData);
      const result = await appointmentService.getAppointmentById(createdAppointment.id);

      expect(result).toEqual(createdAppointment);
    });

    it('should return null when appointment does not exist', async () => {
      const result = await appointmentService.getAppointmentById(999);
      expect(result).toBeNull();
    });
  });

  describe('updateAppointment', () => {
    let existingAppointment;

    beforeEach(async () => {
      const appointmentData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '06-12345678',
        legalArea: 'familierecht',
        date: '2025-12-31',
        time: '10:00',
        type: 'kantoor',
        description: 'Test appointment'
      };
      existingAppointment = await appointmentService.createAppointment(appointmentData);
    });

    it('should update appointment successfully', async () => {
      const updateData = {
        firstName: 'John Updated',
        status: 'completed'
      };

      const result = await appointmentService.updateAppointment(existingAppointment.id, updateData);

      expect(result.firstName).toBe('John Updated');
      expect(result.status).toBe('completed');
      expect(result.updatedAt).toBeDefined();
      expect(result.id).toBe(existingAppointment.id);
      expect(result.email).toBe(existingAppointment.email); // Unchanged field
    });

    it('should return null when appointment does not exist', async () => {
      const result = await appointmentService.updateAppointment(999, { firstName: 'Updated' });
      expect(result).toBeNull();
    });

    it('should validate email when updating', async () => {
      const updateData = { email: 'invalid-email' };

      await expect(appointmentService.updateAppointment(existingAppointment.id, updateData))
        .rejects
        .toThrow('Invalid email format');
    });

    it('should validate date when updating', async () => {
      const updateData = { date: '2023-01-01' }; // Past date

      await expect(appointmentService.updateAppointment(existingAppointment.id, updateData))
        .rejects
        .toThrow('Invalid date format. Use YYYY-MM-DD');
    });

    it('should check slot availability when updating time', async () => {
      // Create another appointment at 11:00
      const anotherAppointmentData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '06-87654321',
        legalArea: 'arbeidsrecht',
        date: '2025-12-31',
        time: '11:00',
        type: 'videobellen',
        description: 'Another appointment'
      };
      await appointmentService.createAppointment(anotherAppointmentData);

      // Try to update the first appointment to 11:00 (should fail)
      const updateData = { time: '11:00' };

      await expect(appointmentService.updateAppointment(existingAppointment.id, updateData))
        .rejects
        .toThrow('This time slot is already booked');
    });

    it('should allow updating to the same time slot', async () => {
      const updateData = { 
        time: '10:00', // Same time
        description: 'Updated description'
      };

      const result = await appointmentService.updateAppointment(existingAppointment.id, updateData);
      expect(result.description).toBe('Updated description');
      expect(result.time).toBe('10:00');
    });
  });

  describe('deleteAppointment', () => {
    it('should delete existing appointment', async () => {
      const appointmentData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '06-12345678',
        legalArea: 'familierecht',
        date: '2025-12-31',
        time: '10:00',
        type: 'kantoor',
        description: 'Test appointment'
      };

      const createdAppointment = await appointmentService.createAppointment(appointmentData);
      const result = await appointmentService.deleteAppointment(createdAppointment.id);

      expect(result).toBe(true);

      // Verify appointment is deleted
      const deletedAppointment = await appointmentService.getAppointmentById(createdAppointment.id);
      expect(deletedAppointment).toBeNull();
    });

    it('should return false when appointment does not exist', async () => {
      const result = await appointmentService.deleteAppointment(999);
      expect(result).toBe(false);
    });
  });

  describe('getAppointmentsByStatus', () => {
    beforeEach(async () => {
      const appointmentData1 = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '06-12345678',
        legalArea: 'familierecht',
        date: '2025-12-31',
        time: '10:00',
        type: 'kantoor',
        description: 'Test appointment 1'
      };
      const appointmentData2 = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '06-87654321',
        legalArea: 'arbeidsrecht',
        date: '2025-12-31',
        time: '11:00',
        type: 'videobellen',
        description: 'Test appointment 2'
      };

      const appointment1 = await appointmentService.createAppointment(appointmentData1);
      const appointment2 = await appointmentService.createAppointment(appointmentData2);

      // Update one appointment status
      await appointmentService.updateAppointment(appointment2.id, { status: 'completed' });
    });

    it('should return appointments with specified status', async () => {
      const scheduledAppointments = await appointmentService.getAppointmentsByStatus('scheduled');
      const completedAppointments = await appointmentService.getAppointmentsByStatus('completed');

      expect(scheduledAppointments).toHaveLength(1);
      expect(scheduledAppointments[0].status).toBe('scheduled');
      expect(completedAppointments).toHaveLength(1);
      expect(completedAppointments[0].status).toBe('completed');
    });
  });

  describe('getAppointmentsByDate', () => {
    beforeEach(async () => {
      const appointmentData1 = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '06-12345678',
        legalArea: 'familierecht',
        date: '2025-12-31',
        time: '10:00',
        type: 'kantoor',
        description: 'Test appointment 1'
      };
      const appointmentData2 = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '06-87654321',
        legalArea: 'arbeidsrecht',
        date: '2026-01-01',
        time: '10:00',
        type: 'videobellen',
        description: 'Test appointment 2'
      };

      await appointmentService.createAppointment(appointmentData1);
      await appointmentService.createAppointment(appointmentData2);
    });

    it('should return appointments for specified date', async () => {
      const appointmentsOnDec31 = await appointmentService.getAppointmentsByDate('2025-12-31');
      const appointmentsOnJan1 = await appointmentService.getAppointmentsByDate('2026-01-01');

      expect(appointmentsOnDec31).toHaveLength(1);
      expect(appointmentsOnDec31[0].date).toBe('2025-12-31');
      expect(appointmentsOnJan1).toHaveLength(1);
      expect(appointmentsOnJan1[0].date).toBe('2026-01-01');
    });
  });

  describe('getAppointmentsByLegalArea', () => {
    beforeEach(async () => {
      const appointmentData1 = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '06-12345678',
        legalArea: 'familierecht',
        date: '2025-12-31',
        time: '10:00',
        type: 'kantoor',
        description: 'Test appointment 1'
      };
      const appointmentData2 = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '06-87654321',
        legalArea: 'arbeidsrecht',
        date: '2025-12-31',
        time: '11:00',
        type: 'videobellen',
        description: 'Test appointment 2'
      };

      await appointmentService.createAppointment(appointmentData1);
      await appointmentService.createAppointment(appointmentData2);
    });

    it('should return appointments for specified legal area', async () => {
      const familyLawAppointments = await appointmentService.getAppointmentsByLegalArea('familierecht');
      const laborLawAppointments = await appointmentService.getAppointmentsByLegalArea('arbeidsrecht');

      expect(familyLawAppointments).toHaveLength(1);
      expect(familyLawAppointments[0].legalArea).toBe('familierecht');
      expect(laborLawAppointments).toHaveLength(1);
      expect(laborLawAppointments[0].legalArea).toBe('arbeidsrecht');
    });
  });

  describe('validation methods', () => {
    describe('isValidEmail', () => {
      it('should validate correct email formats', () => {
        const validEmails = [
          'test@example.com',
          'user.name@example.com',
          'user+tag@example.co.uk',
          'user123@example-domain.com'
        ];

        validEmails.forEach(email => {
          expect(appointmentService.isValidEmail(email)).toBe(true);
        });
      });

      it('should reject invalid email formats', () => {
        const invalidEmails = [
          'invalid-email',
          'user@',
          '@example.com',
          'user@.com',
          'user.example.com',
          'user @example.com',
          ''
        ];

        invalidEmails.forEach(email => {
          expect(appointmentService.isValidEmail(email)).toBe(false);
        });
      });
    });

    describe('isValidDate', () => {
      it('should validate correct date formats and future dates', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().split('T')[0];

        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const nextYearString = nextYear.toISOString().split('T')[0];

        const validDates = [
          tomorrowString,
          nextYearString,
          '2030-01-01'
        ];

        validDates.forEach(date => {
          expect(appointmentService.isValidDate(date)).toBe(true);
        });
      });

      it('should reject invalid date formats and past dates', () => {
        const invalidDates = [
          '2023-01-01', // Past date
          '31-12-2025', // Wrong format
          '2025/12/31', // Wrong format
          '2025-13-01', // Invalid month
          '2025-12-32', // Invalid day
          'invalid-date'
        ];

        invalidDates.forEach(date => {
          expect(appointmentService.isValidDate(date)).toBe(false);
        });
      });
    });

    describe('isValidTime', () => {
      it('should validate correct time formats', () => {
        const validTimes = [
          '09:00',
          '14:30',
          '23:59',
          '00:00'
        ];

        validTimes.forEach(time => {
          expect(appointmentService.isValidTime(time)).toBe(true);
        });
      });

      it('should reject invalid time formats', () => {
        const invalidTimes = [
          '25:00', // Invalid hour
          '12:60', // Invalid minute
          '9:00',  // Missing leading zero
          '12:5',  // Missing leading zero for minute
          'invalid-time'
        ];

        invalidTimes.forEach(time => {
          expect(appointmentService.isValidTime(time)).toBe(false);
        });
      });
    });

    describe('isValidAppointmentType', () => {
      it('should validate correct appointment types', () => {
        expect(appointmentService.isValidAppointmentType('kantoor')).toBe(true);
        expect(appointmentService.isValidAppointmentType('videobellen')).toBe(true);
      });

      it('should reject invalid appointment types', () => {
        const invalidTypes = ['office', 'video', 'phone', 'invalid'];
        invalidTypes.forEach(type => {
          expect(appointmentService.isValidAppointmentType(type)).toBe(false);
        });
      });
    });

    describe('isValidLegalArea', () => {
      it('should validate correct legal areas', () => {
        const validAreas = [
          'ondernemingsrecht',
          'familierecht',
          'arbeidsrecht',
          'bestuursrecht',
          'verbintenissenrecht',
          'overig'
        ];

        validAreas.forEach(area => {
          expect(appointmentService.isValidLegalArea(area)).toBe(true);
        });
      });

      it('should reject invalid legal areas', () => {
        const invalidAreas = ['criminal-law', 'tax-law', 'invalid-area'];
        invalidAreas.forEach(area => {
          expect(appointmentService.isValidLegalArea(area)).toBe(false);
        });
      });
    });
  });

  describe('isSlotAvailable', () => {
    beforeEach(async () => {
      const appointmentData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '06-12345678',
        legalArea: 'familierecht',
        date: '2025-12-31',
        time: '10:00',
        type: 'kantoor',
        description: 'Test appointment'
      };
      await appointmentService.createAppointment(appointmentData);
    });

    it('should return false when slot is already booked', () => {
      const isAvailable = appointmentService.isSlotAvailable('2025-12-31', '10:00');
      expect(isAvailable).toBe(false);
    });

    it('should return true when slot is available', () => {
      const isAvailable = appointmentService.isSlotAvailable('2025-12-31', '11:00');
      expect(isAvailable).toBe(true);
    });

    it('should exclude specific appointment when checking availability', () => {
      const isAvailable = appointmentService.isSlotAvailable('2025-12-31', '10:00', 1);
      expect(isAvailable).toBe(true);
    });
  });
});