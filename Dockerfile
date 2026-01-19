# Multi-stage build: Backend API + Frontend Static Files
# This serves a unified application with FastAPI backend and React frontend

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend files
COPY frontend/package*.json ./
RUN npm ci

# Copy source
COPY frontend/ .

# Build React app
RUN npm run build

# Stage 2: Build and run backend with static frontend
FROM python:3.11-slim

# Avoid interactive prompts during apt installs
ARG DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Install system dependencies
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
  curl \
  && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy frontend build output to serve as static files
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose port (Railway will assign PORT env var)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/streams?class=10 || exit 1

# Run with Railway PORT variable
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
