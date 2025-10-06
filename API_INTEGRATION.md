# API Integration Documentation

This document describes the API integration for the Zaans Recht frontend application.

## Overview

The frontend now includes a custom API module (`js/api.js`) that handles communication with the backend API. The integration supports both the contact form and appointment booking form.

## API Endpoints

The API module expects the following endpoints on the backend:

### Contact Form
- **POST** `/api/contact`
- **Payload:**
```json
{
  "name": "string",
  "email": "string", 
  "phone": "string",
  "subject": "string",
  "message": "string",
  "timestamp": "ISO 8601 string"
}
```

### Appointment Booking
- **POST** `/api/appointments`
- **Payload:**
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
  "timestamp": "ISO 8601 string"
}
```

### Optional Endpoints
- **GET** `/api/appointments/available?date=YYYY-MM-DD` - Get available time slots
- **GET** `/api/health` - Health check

## Configuration

### API Base URL
The API base URL can be configured in `js/config.js`:

```javascript
window.API_CONFIG = {
    baseUrl: 'http://localhost:3000/api',
    environments: {
        development: 'http://localhost:3000/api',
        staging: 'https://staging-api.zaansrecht.nl/api', 
        production: 'https://api.zaansrecht.nl/api'
    }
};
```

### Environment Detection
The system automatically detects the environment based on hostname:
- `localhost` or `127.0.0.1` → development
- Hostnames containing `staging` → staging  
- All other hostnames → production

### Manual Override
You can manually set the API URL by defining `window.API_BASE_URL` before loading the API module:

```html
<script>
window.API_BASE_URL = 'https://my-custom-api.com/api';
</script>
<script src="js/config.js"></script>
<script src="js/api.js"></script>
```

## Error Handling

The API module includes comprehensive error handling:

- **Network errors** (connection refused, no internet)
- **HTTP errors** (4xx, 5xx status codes)  
- **Timeout errors**
- **Invalid response format**

Error messages are displayed to users in Dutch with appropriate context.

## Testing

To test the API integration:

1. Start a local server: `python3 -m http.server 8000`
2. Open `http://localhost:8000` in a browser
3. Fill out and submit either form
4. Check browser console for API calls and error handling

Expected behavior when backend is not running:
- Forms show loading state ("Bezig met verzenden...")
- Network error is caught and appropriate message displayed
- User-friendly error message in Dutch
- Form remains functional for retry

## Files Added/Modified

### New Files:
- `js/api.js` - Main API client module
- `js/config.js` - API configuration  
- `API_INTEGRATION.md` - This documentation

### Modified Files:
- `index.html` - Updated form handlers and added script includes

## Backend Requirements

The backend should:
1. Accept JSON payloads for the specified endpoints
2. Return JSON responses
3. Use appropriate HTTP status codes
4. Support CORS if frontend and backend are on different domains
5. Validate required fields and return meaningful error messages

Example success response:
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "id": "contact_12345"
}
```

Example error response:
```json
{
  "success": false, 
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format"
  }
}
```