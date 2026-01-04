# G4F Chat Application

A modern, real-time chat application powered by GPT-4O using the g4f library, with a React frontend and Flask backend.

## backend

- python
- g4f
- flask

### Use resources
- **pip**
- **g4f** - [Link to pip package](https://pypi.org/project/g4f /)

## frontend 

- react app
- typescript
- vite
- shadcn
- fetch

### Use resources

- **shadcn template** - Shadcn template `pnpm dlx shadcn@latest create --preset "https://ui.shadcn.com/init?base=radix&style=lyra&baseColor=neutral&theme=green&iconLibrary=tabler&font=figtree&menuAccent=bold&menuColor=default&radius=none&template=vite" --template vite`
- **vite** - [Vite](https://vite.dev/) [7.2.7]
- **pnpm**

## Terms

- asynchronous execution of the backend
- message streaming

## Implementation  Roadmap
- [x] initialize the frontend
- [x] create a page with an input field and a message block
- [x] initialize the backend
- [x] use the GPT-4O model
- [x] configure g4f for streaming
- [x] implement streaming in frontend

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- pnpm

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask server:
```bash
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

The frontend will start on `http://localhost:5173`

### Usage

1. Start both the backend and frontend servers
2. Open your browser to `http://localhost:5173`
3. Type a message in the input field
4. Watch the AI response stream in real-time!

## Features

### 🚀 Real-Time Streaming
- **True SSE (Server-Sent Events)**: Messages stream character-by-character as generated
- **Visual Feedback**: Typing indicator and animated cursor during streaming
- **Smart Buffering**: Proper text/event-stream handling with chunk buffering
- **Live Updates**: Watch AI responses appear in real-time

### 💬 Modern Chat Interface
- **Message Bubbles**: Clean, modern chat UI with user/assistant avatars
- **Empty State**: Helpful prompt when starting a new conversation
- **Auto-scroll**: Automatically scrolls to show latest messages
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile

### 🎨 User Experience
- **Loading States**: Visual indicators during message processing
- **Error Handling**: User-friendly error messages
- **Keyboard Support**: Submit with Enter key
- **Request Cancellation**: Abort support for interrupted requests

### 🔧 Technical
- **GPT-4O Model**: Powered by g4f library
- **Asynchronous Backend**: Flask with streaming support
- **React 19**: Modern frontend with TypeScript
- **shadcn/ui**: Beautiful, accessible components
- **CORS-enabled**: Ready for development and production

## Documentation

- [FEATURES.md](FEATURES.md) - Detailed streaming implementation guide
- [UI_GUIDE.md](UI_GUIDE.md) - Visual interface documentation
- [QUICK_START.md](QUICK_START.md) - Quick setup guide
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Architecture overview