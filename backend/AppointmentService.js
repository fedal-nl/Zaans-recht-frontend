import { GenezioError } from './errors.js';

/**
 * Appointment Service - Handles CRUD operations for appointment scheduling
 */
export class AppointmentService {
  constructor() {
    this.appointments = new Map(); // In-memory storage for demo purposes
    this.nextId = 1;
  }

  /**
   * Create a new appointment
   * @param {Object} appointmentData - Appointment information
   * @param {string} appointmentData.firstName - First name
   * @param {string} appointmentData.lastName - Last name
   * @param {string} appointmentData.email - Email address
   * @param {string} appointmentData.phone - Phone number
   * @param {string} appointmentData.legalArea - Legal area (e.g., 'familierecht')
   * @param {string} appointmentData.date - Appointment date (YYYY-MM-DD)
   * @param {string} appointmentData.time - Appointment time (HH:MM)
   * @param {string} appointmentData.type - Appointment type ('kantoor' or 'videobellen')
   * @param {string} appointmentData.description - Description of the legal issue
   * @returns {Object} Created appointment with ID
   */
  async createAppointment(appointmentData) {
    // Validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'legalArea', 'date', 'time', 'type', 'description'];
    for (const field of requiredFields) {
      if (!appointmentData[field]) {
        throw new GenezioError(`Missing required field: ${field}`, 400);
      }
    }

    if (!this.isValidEmail(appointmentData.email)) {
      throw new GenezioError('Invalid email format', 400);
    }

    if (!this.isValidDate(appointmentData.date)) {
      throw new GenezioError('Invalid date format. Use YYYY-MM-DD', 400);
    }

    if (!this.isValidTime(appointmentData.time)) {
      throw new GenezioError('Invalid time format. Use HH:MM', 400);
    }

    if (!this.isValidAppointmentType(appointmentData.type)) {
      throw new GenezioError('Invalid appointment type. Use "kantoor" or "videobellen"', 400);
    }

    if (!this.isValidLegalArea(appointmentData.legalArea)) {
      throw new GenezioError('Invalid legal area', 400);
    }

    // Check if appointment slot is available
    if (!this.isSlotAvailable(appointmentData.date, appointmentData.time)) {
      throw new GenezioError('This time slot is already booked', 409);
    }

    const appointment = {
      id: this.nextId++,
      ...appointmentData,
      createdAt: new Date().toISOString(),
      status: 'scheduled'
    };

    this.appointments.set(appointment.id, appointment);
    return appointment;
  }

  /**
   * Get all appointments
   * @returns {Array} Array of all appointments
   */
  async getAllAppointments() {
    return Array.from(this.appointments.values());
  }

  /**
   * Get an appointment by ID
   * @param {number} id - Appointment ID
   * @returns {Object|null} Appointment object or null if not found
   */
  async getAppointmentById(id) {
    const appointment = this.appointments.get(parseInt(id));
    return appointment || null;
  }

  /**
   * Update an appointment
   * @param {number} id - Appointment ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} Updated appointment or null if not found
   */
  async updateAppointment(id, updateData) {
    const appointment = this.appointments.get(parseInt(id));
    if (!appointment) {
      return null;
    }

    // Validate updated fields
    if (updateData.email && !this.isValidEmail(updateData.email)) {
      throw new GenezioError('Invalid email format', 400);
    }

    if (updateData.date && !this.isValidDate(updateData.date)) {
      throw new GenezioError('Invalid date format. Use YYYY-MM-DD', 400);
    }

    if (updateData.time && !this.isValidTime(updateData.time)) {
      throw new GenezioError('Invalid time format. Use HH:MM', 400);
    }

    if (updateData.type && !this.isValidAppointmentType(updateData.type)) {
      throw new GenezioError('Invalid appointment type. Use "kantoor" or "videobellen"', 400);
    }

    if (updateData.legalArea && !this.isValidLegalArea(updateData.legalArea)) {
      throw new GenezioError('Invalid legal area', 400);
    }

    // Check if new time slot is available (if date or time is being updated)
    if ((updateData.date || updateData.time) && 
        !this.isSlotAvailable(updateData.date || appointment.date, updateData.time || appointment.time, id)) {
      throw new GenezioError('This time slot is already booked', 409);
    }

    const updatedAppointment = {
      ...appointment,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    this.appointments.set(parseInt(id), updatedAppointment);
    return updatedAppointment;
  }

  /**
   * Delete an appointment
   * @param {number} id - Appointment ID
   * @returns {boolean} True if deleted, false if not found
   */
  async deleteAppointment(id) {
    return this.appointments.delete(parseInt(id));
  }

  /**
   * Get appointments by status
   * @param {string} status - Appointment status (scheduled, completed, cancelled)
   * @returns {Array} Array of appointments with the specified status
   */
  async getAppointmentsByStatus(status) {
    return Array.from(this.appointments.values()).filter(appointment => appointment.status === status);
  }

  /**
   * Get appointments by date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Array} Array of appointments on the specified date
   */
  async getAppointmentsByDate(date) {
    return Array.from(this.appointments.values()).filter(appointment => appointment.date === date);
  }

  /**
   * Get appointments by legal area
   * @param {string} legalArea - Legal area
   * @returns {Array} Array of appointments for the specified legal area
   */
  async getAppointmentsByLegalArea(legalArea) {
    return Array.from(this.appointments.values()).filter(appointment => appointment.legalArea === legalArea);
  }

  /**
   * Check if a time slot is available
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {string} time - Time in HH:MM format
   * @param {number} excludeId - Appointment ID to exclude from check (for updates)
   * @returns {boolean} True if slot is available
   */
  isSlotAvailable(date, time, excludeId = null) {
    const existingAppointments = Array.from(this.appointments.values())
      .filter(appointment => 
        appointment.date === date && 
        appointment.time === time && 
        appointment.status === 'scheduled' &&
        appointment.id !== excludeId
      );
    
    return existingAppointments.length === 0;
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate date format
   * @param {string} date - Date to validate (YYYY-MM-DD)
   * @returns {boolean} True if valid date format and future date
   */
  isValidDate(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return false;
    }

    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate >= today && !isNaN(inputDate);
  }

  /**
   * Validate time format
   * @param {string} time - Time to validate (HH:MM)
   * @returns {boolean} True if valid time format
   */
  isValidTime(time) {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  /**
   * Validate appointment type
   * @param {string} type - Appointment type
   * @returns {boolean} True if valid appointment type
   */
  isValidAppointmentType(type) {
    const validTypes = ['kantoor', 'videobellen'];
    return validTypes.includes(type);
  }

  /**
   * Validate legal area
   * @param {string} legalArea - Legal area
   * @returns {boolean} True if valid legal area
   */
  isValidLegalArea(legalArea) {
    const validAreas = [
      'ondernemingsrecht',
      'familierecht', 
      'arbeidsrecht',
      'bestuursrecht',
      'verbintenissenrecht',
      'overig'
    ];
    return validAreas.includes(legalArea);
  }
}