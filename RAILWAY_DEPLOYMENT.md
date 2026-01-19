# 🚂 Railway.app Deployment Guide

## ✨ Why Railway?
- ✅ **Native Docker support** - Automatic container detection & deployment
- ✅ **Full backend support** - Python, Node, Go, Java, etc.
- ✅ **Automatic scaling** - Handles traffic spikes
- ✅ **Affordable** - Pay-as-you-go pricing (~$5-10/month for starter projects)
- ✅ **Simple setup** - One-click GitHub integration
- ✅ **Environment variables** - Easy secrets management

---

## 🚀 Quick Start (5 minutes)

### Option 1: Single Unified Deployment (RECOMMENDED)
Deploy both backend + frontend as ONE container

**Prerequisites:**
- Railway account (https://railway.app)
- GitHub account with Career-path-Navigator repo

**Steps:**

1. **Go to Railway.app**
   ```
   https://railway.app/dashboard
   ```

2. **Create new project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Search for "Career-path-Navigator"
   - Authorize GitHub

3. **Configure Service**
   - **Name**: `career-navigator`
   - **Branch**: `main`
   - **Dockerfile path**: `Dockerfile` (root)
   - **Port**: `8000`

4. **Add Environment Variables**
   ```
   PYTHONUNBUFFERED=1
   PORT=8000
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get live URL: `https://career-navigator.railway.app`

6. **Test**
   - Backend: `https://career-navigator.railway.app/streams?class=10`
   - Frontend: `https://career-navigator.railway.app/`

---

### Option 2: Separate Services (Advanced)
Deploy backend & frontend as independent services

**Backend Service:**
1. New Railway Project
2. Connect GitHub → `main` branch
3. Service name: `career-backend`
4. Dockerfile: `backend/Dockerfile`
5. Deploy

**Frontend Service:**
1. Same Railway Project (add service)
2. Connect GitHub → `main` branch
3. Service name: `career-frontend`
4. Dockerfile: `frontend/Dockerfile`
5. Environment: `VITE_API_URL=https://career-backend.railway.internal`
6. Deploy

---

## 🔧 Configuration Files

### `Dockerfile` (Root)
Unified deployment with multi-stage build:
- Builds React frontend
- Copies to FastAPI static files
- Serves everything from one container
- **Benefits**: Simpler deployment, lower costs, easier CORS

### `railway.json` (Optional)
Railway-specific configuration for auto-detection

---

## 📊 What Gets Deployed

```
career-navigator (Railway Service)
├── Backend: FastAPI (port 8000)
│   ├── /api/streams - Get career streams
│   ├── /api/careers - Get careers
│   └── ... (all FastAPI routes)
├── Frontend: React Static (served at /)
│   ├── /index.html
│   ├── /src/* - React app
│   └── /dist/* - Built assets
└── Health Check: /streams?class=10
```

---

## 🚀 Automatic Deployments

**Every time you push to `main`:**
```bash
git add .
git commit -m "Update career data"
git push origin main
```

Railway automatically:
1. Detects changes
2. Rebuilds Docker image
3. Deploys new version
4. Zero downtime (rolling updates)

---

## 🔍 Monitoring & Logs

### View Logs
```
Railway Dashboard → career-navigator → Logs tab
```

### Monitor Health
```
Railway Dashboard → career-navigator → Deployments tab
```

### Environment Variables
```
Railway Dashboard → career-navigator → Variables tab
```

---

## 💰 Cost Breakdown

| Item | Cost |
|------|------|
| Compute (0.5 CPU, 512MB RAM) | $5/month (always-on) |
| Storage | Free (up to 1GB logs) |
| Bandwidth | Free |
| **Total** | **~$5/month** |

**Tips to save:**
- Use Railway's free tier credits (usually $5-10/month)
- Scale down during off-hours (via dashboard)
- Use shared databases (included)

---

## 🔄 Manual Deployment (Alternative)

If you prefer command-line:

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Link project
cd c:\Users\kuruv\project\carrer
railway link

# 4. Deploy
railway up

# 5. View live URL
railway domain
```

---

## ✅ Deployment Checklist

- [ ] Railway account created
- [ ] GitHub repo connected
- [ ] Dockerfile in root directory ✓
- [ ] `railway.json` configured ✓
- [ ] Environment variables set
- [ ] Service deployed
- [ ] Backend responding: `/streams`
- [ ] Frontend loading at root URL `/`
- [ ] CORS working (frontend → backend)

---

## 🐛 Troubleshooting

### Build Fails
```
Check Logs tab → Look for Docker build errors
Usually: missing requirements or syntax issues
```

### Service won't start
```
Port 8000 in use? Railway auto-assigns from env
Check Variables tab → PORT=8000
```

### Frontend blank page
```
Check browser console → DevTools
Frontend must be built in Docker
Check /dist folder exists
```

### API 404 errors
```
Backend CORS might need frontend URL
Update origins in backend/main.py
Redeploy
```

---

## 📚 Useful Links

- Railway Docs: https://docs.railway.app
- Docker Guide: https://docs.railway.app/getting-started/docker
- FAQ: https://docs.railway.app/reference/faq
- Support: https://discord.com/invite/railway

---

## Next Steps

1. Go to https://railway.app
2. Sign up (free account)
3. Create project from GitHub
4. Follow steps above
5. **You're live!** 🚀

Questions? Check Railway docs or email support@railway.app
