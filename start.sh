#!/bin/bash

echo "Starting G4F Chat Application..."
echo ""

echo "Starting Backend..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

sleep 3

echo "Starting Frontend..."
cd frontend
pnpm dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

wait
