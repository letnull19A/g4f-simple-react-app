# Project Structure

```
g4f_app/
├── backend/
│   ├── app.py                 # Flask application with g4f integration
│   ├── requirements.txt       # Python dependencies
│   └── README.md             # Backend setup instructions
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/          # Shadcn UI components
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       └── input.tsx
│   │   ├── lib/
│   │   │   └── utils.ts     # Utility functions
│   │   ├── App.tsx          # Main chat application
│   │   ├── main.tsx         # React entry point
│   │   └── index.css        # Tailwind CSS styles
│   ├── public/              # Static assets
│   ├── index.html           # HTML template
│   ├── package.json         # Node dependencies
│   ├── vite.config.ts       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   ├── tsconfig.json        # TypeScript configuration
│   └── README.md            # Frontend setup instructions
├── .gitignore               # Git ignore file
├── README.md                # Main project documentation
├── start.bat                # Windows startup script
└── start.sh                 # Linux/Mac startup script
```

## Key Files

### Backend
- **app.py**: Main Flask application with streaming endpoint for g4f
- **requirements.txt**: Flask, flask-cors, and g4f dependencies

### Frontend
- **App.tsx**: Chat interface with real-time streaming
- **components/ui/**: Reusable shadcn UI components
- **vite.config.ts**: Vite configuration with path aliases

## Technology Stack

### Backend
- Python 3.8+
- Flask (web framework)
- g4f (GPT-4O access)
- Flask-CORS (Cross-Origin Resource Sharing)

### Frontend
- React 19
- TypeScript
- Vite 7
- Tailwind CSS 4
- shadcn/ui components
- Lucide React icons

## API Endpoints

- `POST /api/chat` - Send message and receive streaming response
- `GET /health` - Health check endpoint
