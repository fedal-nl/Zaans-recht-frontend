# API Integration Documentation

This document describes the API integration implemented for the Zaans Recht contact and appointment forms.

## Overview

The forms now submit data to configurable API endpoints instead of just showing simulated success messages. The implementation includes proper error handling, loading states, and response processing.

## Configuration

The API endpoints are configured in the `API_CONFIG` object in `index.html`:

```javascript
const API_CONFIG = {
    // Configure these endpoints based on your backend API
    contactFormEndpoint: '/api/contact',
    appointmentFormEndpoint: '/api/appointment',
    // Set to false to disable API calls and use fallback behavior
    apiEnabled: true
};
```

### Configuration Options

- `contactFormEndpoint`: Endpoint for contact form submissions
- `appointmentFormEndpoint`: Endpoint for appointment form submissions  
- `apiEnabled`: Set to `false` to disable API calls and use fallback simulation

## API Endpoints

### Contact Form: `POST /api/contact`

**Request Body:**
```json
{
  "name": "string",
  "email": "string", 
  "phone": "string",
  "subject": "string",
  "message": "string",
  "formType": "contact"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Custom success message",
  "data": {
    "ticketId": "CT-1234567890"  // Optional
  }
}
```

### Appointment Form: `POST /api/appointment`

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "legalArea": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "type": "kantoor|videobellen",
  "description": "string",
  "formType": "appointment"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Custom success message",
  "data": {
    "appointmentId": "AP-1234567890"  // Optional
  }
}
```

## Error Handling

If an API call fails, the system will:

1. Log the error to console
2. Show a user-friendly error message in Dutch
3. Keep the form in a submittable state

**Error Response Format:**
```json
{
  "success": false,
  "error": "Error description",
  "message": "User-friendly error message in Dutch"
}
```

## Features

### Contact Form
- Submits to API and shows custom response message
- If API provides `ticketId`, it's displayed in the success message
- Maintains the 5-second success display before form reset

### Appointment Form  
- Submits to API and shows alert with appointment details
- If API provides `appointmentId`, it's included in the success alert
- Closes modal after successful submission

### Fallback Behavior
- If `apiEnabled` is `false`, forms work with simulated responses
- If API endpoints are unreachable, graceful error handling occurs
- Users always receive feedback, even when API is down

## Testing

A mock API server is included for testing (`/tmp/mock-api.js`):

```bash
node /tmp/mock-api.js
```

This starts a test server on `http://localhost:3001` with the expected endpoints.

## Production Setup

1. Update `API_CONFIG.contactFormEndpoint` and `API_CONFIG.appointmentFormEndpoint` to your production API URLs
2. Ensure your API accepts JSON requests with `Content-Type: application/json`
3. Implement the expected request/response formats shown above
4. Set up CORS if frontend and API are on different domains

## Security Considerations

- All form data is sent as JSON over HTTPS in production
- No sensitive data should be included in API responses
- Rate limiting should be implemented on the API endpoints
- Form validation occurs both client-side and should be repeated server-side