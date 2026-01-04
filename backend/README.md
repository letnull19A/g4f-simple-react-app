# Backend Setup

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows:
```bash
venv\Scripts\activate
```
- Linux/Mac:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Backend

```bash
python app.py
```

The backend will run on `http://localhost:5000`

## API Endpoints

- `POST /api/chat` - Send a message and receive streaming response
- `GET /health` - Health check endpoint
