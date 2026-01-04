# Quick Start Guide

## First Time Setup

### 1. Install Dependencies

#### Backend (Python)
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

#### Frontend (Node.js)
```bash
cd frontend
pnpm install
```

## Running the Application

### Option 1: Use the Start Scripts

#### Windows
```bash
start.bat
```

#### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual Start

#### Terminal 1 - Backend
```bash
cd backend
# Activate venv first (see above)
python app.py
```

#### Terminal 2 - Frontend
```bash
cd frontend
pnpm dev
```

## Access the Application

Once both servers are running:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Usage

1. Open your browser to http://localhost:5173
2. Type your message in the input field
3. Press Enter or click the Send button
4. Watch the AI response stream in real-time!

## Troubleshooting

### Backend Issues
- Make sure Python 3.8+ is installed
- Ensure virtual environment is activated
- Check that g4f package installed correctly

### Frontend Issues
- Make sure Node.js 18+ is installed
- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
- Check that port 5173 is not in use

### CORS Issues
- Ensure backend is running on port 5000
- Flask-CORS is configured to allow all origins in development

## Building for Production

### Frontend
```bash
cd frontend
pnpm build
```

The built files will be in `frontend/dist/`

### Backend
The Flask app is production-ready. For deployment:
- Set `debug=False` in [app.py](backend/app.py:49)
- Use a production WSGI server like Gunicorn or uWSGI
- Configure proper CORS origins
