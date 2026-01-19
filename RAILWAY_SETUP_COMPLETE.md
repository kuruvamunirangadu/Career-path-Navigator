# 🚂 Railway Deployment Complete Setup

## ✅ What's Ready

Your project is now fully configured for Railway deployment:

```
✓ Dockerfile (root) - Multi-stage build with merged frontend + backend
✓ railway.json - Configuration file
✓ deploy-railway.sh - Bash deployment script
✓ deploy-railway.bat - Windows deployment script
✓ backend/main.py - Updated to serve static files
✓ RAILWAY_DEPLOYMENT.md - Detailed guide
```

---

## 🚀 Deploy in 5 Minutes

### Method 1: Web Dashboard (Easiest)

1. **Go to Railway**
   ```
   https://railway.app
   ```

2. **Sign up (free account)**
   - Click "Dashboard"
   - Sign up with GitHub

3. **Create new project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Search: `Career-path-Navigator`
   - Select the repo

4. **Configure service**
   - **Repo**: Career-path-Navigator
   - **Branch**: main
   - **Dockerfile**: `./Dockerfile` (auto-detected)
   - **Port**: 8000

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - **Live URL**: Check "Deployments" tab

6. **Test**
   ```
   API:      https://<your-domain>/streams?class=10
   Frontend: https://<your-domain>/
   ```

---

### Method 2: CLI (Quick)

```bash
# On Windows - use Git Bash or WSL, or run:
deploy-railway.bat

# On Mac/Linux:
chmod +x deploy-railway.sh
./deploy-railway.sh
```

---

### Method 3: Manual CLI

```bash
# 1. Install Railway
npm install -g @railway/cli

# 2. Login
railway login

# 3. Link project
railway link

# 4. Deploy
railway up

# 5. Get URL
railway domain
```

---

## 📊 What Gets Deployed

**Single Container on Railway:**
```
https://career-navigator-xxxx.railway.app
├── Backend (FastAPI)
│   ├── /streams - Get career streams
│   ├── /variants - Get stream variants
│   ├── /paths - Get career paths
│   ├── /careers/{id} - Get career details
│   ├── /ai/explain - AI explanations
│   └── /nba - Next-best-actions
├── Frontend (React)
│   ├── / - Main app
│   ├── /index.html
│   ├── /src - React components
│   └── /dist - Built assets
└── Health Check: /streams?class=10
```

---

## 🔧 Environment Variables (if needed)

Set in Railway Dashboard → Variables:

```
PYTHONUNBUFFERED=1    # Python logging
PORT=8000              # API port
```

---

## 📈 Automatic Deployments

**Every `git push` to `main`:**

```bash
git add .
git commit -m "Update career data"
git push origin main
```

Railway automatically:
1. Detects changes
2. Rebuilds container
3. Deploys (zero downtime)
4. Updates live URL

---

## 💡 Key Features

| Feature | Status |
|---------|--------|
| Docker Support | ✅ Full |
| Backend (Python/FastAPI) | ✅ Included |
| Frontend (React/Vite) | ✅ Included |
| Static File Serving | ✅ Configured |
| Health Checks | ✅ Enabled |
| Auto-scaling | ✅ Available |
| Custom Domain | ✅ Supported |
| CORS | ✅ Configured |
| Environment Variables | ✅ Supported |
| CI/CD (GitHub) | ✅ Automatic |

---

## 🎯 Comparison: Railway vs Others

| Platform | Docker | Python | Cost | Setup Time |
|----------|--------|--------|------|-----------|
| **Railway** | ✅ Full | ✅ Yes | $5/mo | 5 min |
| Render | ✅ Full | ✅ Yes | $7/mo | 5 min |
| Vercel | ❌ No | ❌ No | Free | - (N/A) |
| Azure | ✅ Full | ✅ Yes | $10-50/mo | 15 min |
| AWS | ✅ Full | ✅ Yes | $5-20/mo | 20 min |

**Railway wins for simplicity + features!**

---

## 🔍 Monitoring & Logs

### View Logs
```
Railway Dashboard → Select Project → Logs tab
```

### View Metrics
```
Railway Dashboard → Select Project → Metrics tab
- CPU usage
- Memory usage
- Network I/O
- Error rates
```

### View Deployments
```
Railway Dashboard → Select Project → Deployments tab
- Deployment history
- Logs per deployment
- Rollback options
```

---

## ⚡ Performance Tips

1. **Caching**
   - Railway caches Docker layers (faster rebuilds)
   - Static files served from CDN

2. **Scaling**
   - Manual scaling in dashboard
   - Auto-scaling available on paid plans

3. **Cost Optimization**
   - Free tier: 500 hours/month
   - Starter plan: ~$5/month (recommended)
   - Stop/pause service to save

---

## 🐛 Troubleshooting

### Build Fails
```
Check Logs tab → Search for error
Common: Missing Python package
Fix: Update backend/requirements.txt
```

### Service Won't Start
```
Port conflict? Railway auto-assigns ports
Check Variables → PORT setting
Check logs for startup errors
```

### Frontend Blank
```
Check browser console (F12)
Verify React build succeeded
Check /dist folder in Dockerfile
```

### API 404 Errors
```
Backend endpoints responding?
Test: https://domain/streams?class=10
Check CORS settings if frontend fails
```

### Environment Variables Not Working
```
Set in Dashboard → Variables tab
Wait 2-3 minutes for redeploy
Check logs to confirm they're loaded
```

---

## 📚 Next Steps

1. **Go to Railway**: https://railway.app
2. **Create Account**: Free with GitHub
3. **New Project**: Connect Career-path-Navigator
4. **Deploy**: Click deploy button
5. **Test**: Visit live URL
6. **Monitor**: Check logs/metrics
7. **Share**: Get live URL to team

---

## 🔗 Useful Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Documentation**: https://docs.railway.app
- **GitHub Integration**: https://docs.railway.app/getting-started/github
- **Docker Guide**: https://docs.railway.app/getting-started/docker
- **Environment Vars**: https://docs.railway.app/develop/variables
- **Pricing**: https://railway.app/pricing
- **Community**: https://discord.com/invite/railway

---

## 💬 Support

- **Railway Support**: https://railway.app/support
- **Discord Community**: https://discord.com/invite/railway
- **Documentation**: https://docs.railway.app

---

## ✨ Success Checklist

- [ ] Railway account created
- [ ] GitHub repo connected
- [ ] Service deployed
- [ ] Backend responding: `/streams`
- [ ] Frontend loading at root URL
- [ ] Health checks passing
- [ ] Logs accessible
- [ ] Live URL working
- [ ] Ready for production! 🎉

---

**Last Updated**: January 19, 2026
**Deployment Target**: Railway.app
**Status**: ✅ Ready to Deploy
