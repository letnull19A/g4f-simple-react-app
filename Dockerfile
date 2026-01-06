FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
COPY frontend/ ./

RUN npm install && \
    npm run build && \
    rm -rf \
        node_modules \
        src \
        tsconfig*.json \
        tailwind.config.js \
        vite.config.js

# Stage 2: Python backend with built frontend
FROM python:3.11-slim

WORKDIR /app
COPY backend/requirements.txt ./backend/

RUN apt-get update && apt-get install -y \
    gcc && \
    rm -rf /var/lib/apt/lists/* && \
    pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 5000

ENV FLASK_APP=backend/app.py
ENV PYTHONUNBUFFERED=1

CMD ["python", "backend/app.py"]