# Zaans Recht CLI Application

This directory contains a command line interface application for Zaans Recht built with Python 3.13, InquirerPy, and Rich.

## Features

- Interactive command line interface using InquirerPy
- Beautiful terminal output with Rich formatting
- Docker containerization support
- Menu-driven navigation
- Legal information display
- Document search functionality (demo)
- Contact information display

## Requirements

- Python 3.13
- InquirerPy >= 0.3.4
- Rich >= 13.7.0

## Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python main.py
```

## Docker Usage

### Option 1: Docker Build & Run
1. Build the Docker image:
```bash
docker build -t zaans-recht-cli .
```

2. Run the container:
```bash
docker run -it zaans-recht-cli
```

### Option 2: Docker Compose (Recommended)
```bash
docker compose up --build
```

To stop and remove the container:
```bash
docker compose down
```

## Application Structure

- `main.py` - Main CLI application entry point
- `requirements.txt` - Python dependencies
- `Dockerfile` - Docker container configuration
- `README.md` - This documentation file