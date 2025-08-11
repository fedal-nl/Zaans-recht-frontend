import { GenezioError } from './errors.js';

/**
 * Contact Service - Handles CRUD operations for contact form submissions
 */
export class ContactService {
  constructor() {
    this.contacts = new Map(); // In-memory storage for demo purposes
    this.nextId = 1;
  }

  /**
   * Create a new contact
   * @param {Object} contactData - Contact information
   * @param {string} contactData.name - Contact name
   * @param {string} contactData.email - Contact email
   * @param {string} contactData.phone - Contact phone number
   * @param {string} contactData.subject - Contact subject
   * @param {string} contactData.message - Contact message
   * @returns {Object} Created contact with ID
   */
  async createContact(contactData) {
    // Validation
    if (!contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
      throw new GenezioError('Missing required fields', 400);
    }

    if (!this.isValidEmail(contactData.email)) {
      throw new GenezioError('Invalid email format', 400);
    }

    const contact = {
      id: this.nextId++,
      ...contactData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    this.contacts.set(contact.id, contact);
    return contact;
  }

  /**
   * Get all contacts
   * @returns {Array} Array of all contacts
   */
  async getAllContacts() {
    return Array.from(this.contacts.values());
  }

  /**
   * Get a contact by ID
   * @param {number} id - Contact ID
   * @returns {Object|null} Contact object or null if not found
   */
  async getContactById(id) {
    const contact = this.contacts.get(parseInt(id));
    return contact || null;
  }

  /**
   * Update a contact
   * @param {number} id - Contact ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} Updated contact or null if not found
   */
  async updateContact(id, updateData) {
    const contact = this.contacts.get(parseInt(id));
    if (!contact) {
      return null;
    }

    // Validate email if it's being updated
    if (updateData.email && !this.isValidEmail(updateData.email)) {
      throw new GenezioError('Invalid email format', 400);
    }

    const updatedContact = {
      ...contact,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    this.contacts.set(parseInt(id), updatedContact);
    return updatedContact;
  }

  /**
   * Delete a contact
   * @param {number} id - Contact ID
   * @returns {boolean} True if deleted, false if not found
   */
  async deleteContact(id) {
    return this.contacts.delete(parseInt(id));
  }

  /**
   * Get contacts by status
   * @param {string} status - Contact status (pending, resolved, etc.)
   * @returns {Array} Array of contacts with the specified status
   */
  async getContactsByStatus(status) {
    return Array.from(this.contacts.values()).filter(contact => contact.status === status);
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
}