# 🚀 Career App - Live Deployment Guide

## Overview
Deploy Career Path Navigator as a live web application on Azure with CI/CD automation.

**Architecture:**
- **Backend**: FastAPI (Python) → Azure Container Apps
- **Frontend**: React + Vite → Azure Static Web Apps
- **Data**: JSON files in container
- **CI/CD**: GitHub Actions → Automated deployment on push

---

## 📋 Prerequisites

### 1. Required Accounts & Tools
- ✅ GitHub account (already have: kuruvamunirangadu/Career-path-Navigator)
- ✅ Azure account (free tier eligible: $200 credit)
- ✅ Docker Desktop (for local testing)
- Azure CLI installed

### 2. Azure Resources Needed
```
┌─────────────────────────────────────────┐
│          Azure Deployment                │
├─────────────────────────────────────────┤
│ • Container Apps (backend FastAPI)      │
│ • Static Web App (frontend React)       │
│ • Container Registry (Docker images)    │
│ • Cosmos DB/Storage (if scaling needed) │
└─────────────────────────────────────────┘
```

---

## 🐳 Step 1: Containerization

### 1.1 Backend Dockerfile
```dockerfile
# Dockerfile - backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY backend/ .

# Expose port
EXPOSE 8000

# Run FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 1.2 Frontend Dockerfile
```dockerfile
# Dockerfile - frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

# Serve with simple HTTP server
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### 1.3 Build & Test Locally
```bash
# Build backend image
docker build -t career-backend:latest -f backend/Dockerfile .

# Build frontend image  
docker build -t career-frontend:latest -f frontend/Dockerfile .

# Test backend
docker run -p 8000:8000 career-backend:latest

# Test frontend
docker run -p 3000:3000 career-frontend:latest
```

---

## ☁️ Step 2: Azure Setup

### 2.1 Create Resource Group
```bash
az group create \
  --name career-app-rg \
  --location eastus
```

### 2.2 Create Azure Container Registry (ACR)
```bash
az acr create \
  --resource-group career-app-rg \
  --name careerappregistry \
  --sku Basic
```

### 2.3 Push Images to ACR
```bash
# Login to ACR
az acr login --name careerappregistry

# Tag images
docker tag career-backend:latest careerappregistry.azurecr.io/career-backend:latest
docker tag career-frontend:latest careerappregistry.azurecr.io/career-frontend:latest

# Push images
docker push careerappregistry.azurecr.io/career-backend:latest
docker push careerappregistry.azurecr.io/career-frontend:latest
```

---

## 🔧 Step 3: Deployment Options

### Option A: Azure Container Apps (Recommended)

#### Backend Deployment
```bash
az containerapp create \
  --resource-group career-app-rg \
  --name career-backend \
  --image careerappregistry.azurecr.io/career-backend:latest \
  --environment career-app-env \
  --ingress external \
  --target-port 8000 \
  --registry-server careerappregistry.azurecr.io \
  --cpu 0.5 --memory 1.0Gi
```

#### Frontend Deployment
```bash
az containerapp create \
  --resource-group career-app-rg \
  --name career-frontend \
  --image careerappregistry.azurecr.io/career-frontend:latest \
  --environment career-app-env \
  --ingress external \
  --target-port 3000 \
  --registry-server careerappregistry.azurecr.io \
  --cpu 0.5 --memory 1.0Gi
```

### Option B: Azure Static Web Apps (Frontend Only)
- Excellent for React apps
- Free HTTPS, auto-scaling, CDN included
- Works with GitHub Actions for CI/CD

### Option C: App Service (Traditional)
- More control
- Better for long-running processes
- Suitable if you need Windows runtime

---

## 🤖 Step 4: CI/CD with GitHub Actions

### Create `.github/workflows/deploy.yml`
```yaml
name: Deploy Career App

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      
      - name: Build and Push Backend
        run: |
          az acr build \
            --registry careerappregistry \
            --image career-backend:${{ github.sha }} \
            --file backend/Dockerfile .
      
      - name: Build and Push Frontend
        run: |
          az acr build \
            --registry careerappregistry \
            --image career-frontend:${{ github.sha }} \
            --file frontend/Dockerfile .
      
      - name: Deploy Container Apps
        run: |
          az containerapp update \
            --resource-group career-app-rg \
            --name career-backend \
            --image careerappregistry.azurecr.io/career-backend:${{ github.sha }}
          
          az containerapp update \
            --resource-group career-app-rg \
            --name career-frontend \
            --image careerappregistry.azurecr.io/career-frontend:${{ github.sha }}
```

---

## 🌐 Step 5: Configure Frontend for Production

Update `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 
                     'http://localhost:8000';

export const fetchChatbot = (question) => {
  return fetch(`${API_BASE_URL}/chatbot/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  }).then(r => r.json());
};
```

Update `frontend/.env.production`:
```
REACT_APP_API_URL=https://career-backend.azurecontainerapps.io
```

---

## 💰 Cost Estimation (Azure)

| Service | Tier | Monthly Cost |
|---------|------|-------------|
| Container Apps | Pay-per-use | $10-20 |
| Static Web Apps | Free tier | Free |
| Container Registry | Basic | $5 |
| **Total** | | **~$15-25/month** |

---

## ✅ Deployment Checklist

- [ ] Docker installed locally
- [ ] Dockerfiles created (backend + frontend)
- [ ] Local Docker tests pass
- [ ] Azure account created
- [ ] Resource group created
- [ ] Container Registry created
- [ ] Images pushed to ACR
- [ ] Container Apps deployed
- [ ] Frontend env vars configured
- [ ] GitHub Actions workflow created
- [ ] Azure credentials added to GitHub Secrets
- [ ] DNS/Custom domain configured (optional)
- [ ] SSL certificates auto-configured
- [ ] Monitoring/Alerts set up

---

## 🧪 Post-Deployment Testing

```bash
# Test backend
curl https://career-backend.azurecontainerapps.io/streams?class=10

# Test frontend
curl https://career-frontend.azurecontainerapps.io

# Check logs
az containerapp logs show \
  --resource-group career-app-rg \
  --name career-backend \
  --follow
```

---

## 📊 Monitoring & Maintenance

### Enable Application Insights
```bash
az containerapp create \
  ... \
  --enable-dapr \
  --dapr-app-id career-backend
```

### Auto-scaling
```bash
az containerapp update \
  --resource-group career-app-rg \
  --name career-backend \
  --min-replicas 2 \
  --max-replicas 5
```

---

## 🔐 Security Considerations

1. **Environment Variables**: Store API keys in Azure Key Vault
2. **CORS**: Update FastAPI CORS to allow frontend domain
3. **Rate Limiting**: Implement request throttling
4. **Authentication**: Add user auth if needed (Azure AD)
5. **Data**: Backup JSON career data regularly

---

## Next Steps

**Quick Start** (15 minutes):
1. Follow Steps 1-2 (Containerization + Azure Setup)
2. Run local Docker tests
3. Push to ACR

**Full Deployment** (30 minutes):
4. Deploy Container Apps (Step 3)
5. Set up GitHub Actions (Step 4)
6. Configure frontend env vars (Step 5)
7. Test production URLs

**Production Ready** (1 hour):
8. Add custom domain
9. Set up monitoring
10. Configure auto-scaling
11. Create backup strategy

---

**Need help? Ready to proceed with any step? Let me know!** 🚀
