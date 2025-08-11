import { ContactService } from '../backend/ContactService.js';

describe('ContactService', () => {
  let contactService;

  beforeEach(() => {
    contactService = new ContactService();
  });

  describe('createContact', () => {
    const validContactData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '06-12345678',
      subject: 'algemene-vraag',
      message: 'Dit is een test bericht'
    };

    it('should create a contact successfully with valid data', async () => {
      const result = await contactService.createContact(validContactData);

      expect(result).toEqual({
        id: 1,
        ...validContactData,
        createdAt: expect.any(String),
        status: 'pending'
      });
      expect(new Date(result.createdAt)).toBeInstanceOf(Date);
    });

    it('should assign incremental IDs to contacts', async () => {
      const contact1 = await contactService.createContact(validContactData);
      const contact2 = await contactService.createContact(validContactData);

      expect(contact1.id).toBe(1);
      expect(contact2.id).toBe(2);
    });

    it('should throw error when required fields are missing', async () => {
      const invalidData = { name: 'John Doe', email: 'john@example.com' };

      await expect(contactService.createContact(invalidData))
        .rejects
        .toThrow('Missing required fields');
    });

    it('should throw error when email is invalid', async () => {
      const invalidEmailData = {
        ...validContactData,
        email: 'invalid-email'
      };

      await expect(contactService.createContact(invalidEmailData))
        .rejects
        .toThrow('Invalid email format');
    });

    it('should validate all required fields', async () => {
      const requiredFields = ['name', 'email', 'subject', 'message'];
      
      for (const field of requiredFields) {
        const dataWithoutField = { ...validContactData };
        delete dataWithoutField[field];

        await expect(contactService.createContact(dataWithoutField))
          .rejects
          .toThrow('Missing required fields');
      }
    });
  });

  describe('getAllContacts', () => {
    it('should return empty array when no contacts exist', async () => {
      const result = await contactService.getAllContacts();
      expect(result).toEqual([]);
    });

    it('should return all contacts', async () => {
      const contactData1 = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '06-12345678',
        subject: 'algemene-vraag',
        message: 'Test message 1'
      };
      const contactData2 = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '06-87654321',
        subject: 'juridisch-advies',
        message: 'Test message 2'
      };

      const contact1 = await contactService.createContact(contactData1);
      const contact2 = await contactService.createContact(contactData2);

      const result = await contactService.getAllContacts();
      expect(result).toHaveLength(2);
      expect(result).toContain(contact1);
      expect(result).toContain(contact2);
    });
  });

  describe('getContactById', () => {
    it('should return contact when it exists', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '06-12345678',
        subject: 'algemene-vraag',
        message: 'Test message'
      };

      const createdContact = await contactService.createContact(contactData);
      const result = await contactService.getContactById(createdContact.id);

      expect(result).toEqual(createdContact);
    });

    it('should return null when contact does not exist', async () => {
      const result = await contactService.getContactById(999);
      expect(result).toBeNull();
    });

    it('should handle string IDs by converting to number', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '06-12345678',
        subject: 'algemene-vraag',
        message: 'Test message'
      };

      const createdContact = await contactService.createContact(contactData);
      const result = await contactService.getContactById(createdContact.id.toString());

      expect(result).toEqual(createdContact);
    });
  });

  describe('updateContact', () => {
    let existingContact;

    beforeEach(async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '06-12345678',
        subject: 'algemene-vraag',
        message: 'Test message'
      };
      existingContact = await contactService.createContact(contactData);
    });

    it('should update contact successfully', async () => {
      const updateData = {
        name: 'John Updated',
        status: 'resolved'
      };

      const result = await contactService.updateContact(existingContact.id, updateData);

      expect(result.name).toBe('John Updated');
      expect(result.status).toBe('resolved');
      expect(result.updatedAt).toBeDefined();
      expect(result.id).toBe(existingContact.id);
      expect(result.email).toBe(existingContact.email); // Unchanged field
    });

    it('should return null when contact does not exist', async () => {
      const result = await contactService.updateContact(999, { name: 'Updated' });
      expect(result).toBeNull();
    });

    it('should validate email when updating', async () => {
      const updateData = { email: 'invalid-email' };

      await expect(contactService.updateContact(existingContact.id, updateData))
        .rejects
        .toThrow('Invalid email format');
    });

    it('should update contact with valid email', async () => {
      const updateData = { email: 'newemail@example.com' };

      const result = await contactService.updateContact(existingContact.id, updateData);
      expect(result.email).toBe('newemail@example.com');
    });
  });

  describe('deleteContact', () => {
    it('should delete existing contact', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '06-12345678',
        subject: 'algemene-vraag',
        message: 'Test message'
      };

      const createdContact = await contactService.createContact(contactData);
      const result = await contactService.deleteContact(createdContact.id);

      expect(result).toBe(true);

      // Verify contact is deleted
      const deletedContact = await contactService.getContactById(createdContact.id);
      expect(deletedContact).toBeNull();
    });

    it('should return false when contact does not exist', async () => {
      const result = await contactService.deleteContact(999);
      expect(result).toBe(false);
    });
  });

  describe('getContactsByStatus', () => {
    beforeEach(async () => {
      // Create contacts with different statuses
      const contactData1 = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '06-12345678',
        subject: 'algemene-vraag',
        message: 'Test message 1'
      };
      const contactData2 = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '06-87654321',
        subject: 'juridisch-advies',
        message: 'Test message 2'
      };

      const contact1 = await contactService.createContact(contactData1);
      const contact2 = await contactService.createContact(contactData2);

      // Update one contact status
      await contactService.updateContact(contact2.id, { status: 'resolved' });
    });

    it('should return contacts with specified status', async () => {
      const pendingContacts = await contactService.getContactsByStatus('pending');
      const resolvedContacts = await contactService.getContactsByStatus('resolved');

      expect(pendingContacts).toHaveLength(1);
      expect(pendingContacts[0].status).toBe('pending');
      expect(resolvedContacts).toHaveLength(1);
      expect(resolvedContacts[0].status).toBe('resolved');
    });

    it('should return empty array when no contacts have the specified status', async () => {
      const result = await contactService.getContactsByStatus('archived');
      expect(result).toEqual([]);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@example-domain.com'
      ];

      validEmails.forEach(email => {
        expect(contactService.isValidEmail(email)).toBe(true);
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
        expect(contactService.isValidEmail(email)).toBe(false);
      });
    });
  });
});