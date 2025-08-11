# Zaans Recht Backend API

This is a Django REST Framework API for the Zaans Recht legal services website.

## Features

- Django 5.1.5 with Python 3.13
- Django REST Framework for API endpoints
- SQLite3 database
- Docker containerization
- CORS enabled for frontend integration

## API Endpoints

- `GET /api/` - API root with endpoint information
- `GET /api/legal-services/` - List all legal services
- `POST /api/contact-requests/` - Submit contact form
- `GET /api/contact-requests/` - List contact requests (admin)
- `POST /api/appointments/` - Submit appointment request
- `GET /api/appointments/` - List appointment requests (admin)

## Models

### LegalService
- Legal services offered by the firm
- Fields: name, description, icon, timestamps

### ContactRequest
- Contact form submissions
- Fields: name, email, phone, subject, message, timestamps, is_processed

### Appointment
- Appointment requests
- Fields: personal info, legal area, appointment type, preferred date/time, description, timestamps, is_confirmed

## Setup

### Local Development

1. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py migrate
```

3. Load sample data:
```bash
python manage.py load_legal_services
```

4. Start development server:
```bash
python manage.py runserver
```

### Docker

1. Build and run with Docker Compose:
```bash
docker compose up --build
```

The API will be available at http://localhost:8000/api/

## Environment Variables

- `DEBUG` - Enable debug mode (default: 1 for development)
- `SECRET_KEY` - Django secret key

## Database

Uses SQLite3 by default. The database file is created at `backend/db.sqlite3`.

## CORS Configuration

Configured to allow requests from frontend applications. In production, update `CORS_ALLOWED_ORIGINS` in settings.py with your frontend domain.