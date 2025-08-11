# Backend API Documentation

This project includes backend CRUD services for managing contacts and appointments.

## Services

### ContactService

Handles contact form submissions with the following operations:

#### CRUD Operations
- `createContact(contactData)` - Create a new contact
- `getAllContacts()` - Get all contacts  
- `getContactById(id)` - Get contact by ID
- `updateContact(id, updateData)` - Update a contact
- `deleteContact(id)` - Delete a contact

#### Additional Methods
- `getContactsByStatus(status)` - Filter contacts by status
- `isValidEmail(email)` - Validate email format

#### Contact Data Structure
```javascript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string,
  createdAt: string,
  updatedAt?: string,
  status: string // 'pending', 'resolved', etc.
}
```

### AppointmentService

Handles appointment scheduling with the following operations:

#### CRUD Operations
- `createAppointment(appointmentData)` - Create a new appointment
- `getAllAppointments()` - Get all appointments
- `getAppointmentById(id)` - Get appointment by ID
- `updateAppointment(id, updateData)` - Update an appointment
- `deleteAppointment(id)` - Delete an appointment

#### Additional Methods
- `getAppointmentsByStatus(status)` - Filter appointments by status
- `getAppointmentsByDate(date)` - Filter appointments by date
- `getAppointmentsByLegalArea(legalArea)` - Filter appointments by legal area
- `isSlotAvailable(date, time, excludeId?)` - Check time slot availability

#### Validation Methods
- `isValidEmail(email)` - Validate email format
- `isValidDate(date)` - Validate date format and ensure future date
- `isValidTime(time)` - Validate time format (HH:MM)
- `isValidAppointmentType(type)` - Validate appointment type
- `isValidLegalArea(legalArea)` - Validate legal area

#### Appointment Data Structure
```javascript
{
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  legalArea: string, // 'familierecht', 'arbeidsrecht', etc.
  date: string, // YYYY-MM-DD
  time: string, // HH:MM
  type: string, // 'kantoor' or 'videobellen'
  description: string,
  createdAt: string,
  updatedAt?: string,
  status: string // 'scheduled', 'completed', 'cancelled'
}
```

## Valid Values

### Legal Areas
- `ondernemingsrecht`
- `familierecht`
- `arbeidsrecht`
- `bestuursrecht`
- `verbintenissenrecht`
- `overig`

### Appointment Types
- `kantoor` - Office visit
- `videobellen` - Video call

### Contact Subjects
- `algemene-vraag` - General question
- `juridisch-advies` - Legal advice
- `afspraak-maken` - Make appointment
- `offerte-aanvragen` - Request quote
- `klacht` - Complaint
- `overig` - Other

## Testing

Run unit tests with:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

The test suite includes 57 test cases covering:
- All CRUD operations
- Input validation
- Error handling
- Edge cases
- Business logic

Test coverage:
- Statement coverage: 96.84%
- Branch coverage: 90.41%
- Function coverage: 100%