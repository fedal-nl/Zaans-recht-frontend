# Zaans-recht-frontend
A complete solution for Zaans Recht legal services, including both frontend website and backend API.

## Structure

- **Frontend**: Static HTML/CSS website for Zaans Recht legal services
- **Backend**: Django REST Framework API for handling contact forms and appointments

## Frontend

The frontend is a simple, responsive website built with HTML, CSS, and Tailwind CSS. It features:
- Legal services showcase
- Contact form
- Appointment booking
- Professional design with Dutch legal theme

## Backend API

The backend provides a REST API built with Django and Django REST Framework:
- Python 3.13
- SQLite3 database
- Docker containerization
- API endpoints for legal services, contact requests, and appointments

### Quick Start with Docker

```bash
docker compose up --build
```

The API will be available at http://localhost:8000/api/

For detailed backend setup instructions, see [backend/README.md](backend/README.md).
