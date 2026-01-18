# 🚀 Deploy to Render & Vercel (Cost-Effective)

## Overview
- **Backend**: Render (Python/FastAPI) - Free tier available
- **Frontend**: Vercel (React) - Free tier available
- **Total Cost**: $0/month on free tiers, ~$7-15/month with paid tiers

---

## 📋 Prerequisites
- GitHub account (repo already connected)
- Render account: https://render.com
- Vercel account: https://vercel.com
- GitHub repo access token (optional, for automation)

---

## 🔧 Step 1: Deploy Backend to Render

### A. Create Render Account & Connect GitHub
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (easier)
3. Authorize GitHub access

### B. Create a Web Service on Render
1. Dashboard → **New +** → **Web Service**
2. Select your repo: `Career-path-Navigator`
3. Fill in these details:

| Field | Value |
|-------|-------|
| **Name** | `career-navigator-backend` |
| **Environment** | `Python 3` |
| **Root Directory** | `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port 8000` |
| **Plan** | `Free` (or Starter $7/mo) |

4. **Environment Variables** (click "Add Environment Variable"):
```
PYTHONUNBUFFERED=true
PORT=8000
```

5. Click **Deploy** → Wait 3-5 minutes

### C. Get Your Backend URL
```
Your backend will be available at:
https://career-navigator-backend.onrender.com
```

---

## 🎨 Step 2: Deploy Frontend to Vercel

### A. Create Vercel Account & Connect GitHub
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize GitHub access

### B. Create Project on Vercel
1. Dashboard → **Add New** → **Project**
2. Select: `Career-path-Navigator`
3. Fill in project settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### C. Set Environment Variables
Click **Environment Variables** → Add:
```
VITE_API_URL = https://career-navigator-backend.onrender.com
```

4. Click **Deploy** → Wait 2-3 minutes

### D. Get Your Frontend URL
```
Your frontend will be available at:
https://career-path-navigator.vercel.app
```

---

## 🔗 Step 3: Connect Frontend to Backend

### Update Frontend API Configuration
Edit `frontend/src/config.js` or wherever API calls are made:

```javascript
// frontend/src/config.js
export const API_BASE_URL = process.env.VITE_API_URL || 'https://career-navigator-backend.onrender.com';
```

Or if using environment variable directly:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## 🚀 Step 4: Enable Auto-Deployment

Both Render and Vercel automatically watch your GitHub repo:
- Any push to `main` → Auto-deploys
- No manual steps needed!

---

## ✅ Verification Checklist

```
Backend (Render):
☐ Service created and deployed
☐ URL accessible: https://career-navigator-backend.onrender.com
☐ Test health endpoint: curl https://career-navigator-backend.onrender.com/health

Frontend (Vercel):
☐ Project created and deployed
☐ URL accessible: https://career-path-navigator.vercel.app
☐ Can load homepage without errors
☐ API calls work (check browser console for errors)

Connection:
☐ Frontend successfully connects to backend
☐ Data loads without CORS errors
```

---

## 💰 Cost Comparison

| Service | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| **Render Backend** | Yes ($0) | $7/mo | 0.5 GB RAM, shared CPU |
| **Vercel Frontend** | Yes ($0) | $20/mo | Unlimited bandwidth |
| **Total** | **$0/mo** | **~$27/mo** | Start free, scale later |

**Azure equivalent**: ~$50-200/month 😱

---

## 📝 Useful Commands

### Monitor Logs
```bash
# Render backend logs
# View in: https://dashboard.render.com → Select service → Logs

# Vercel frontend logs  
# View in: https://vercel.com → Select project → Deployments → Logs
```

### Manual Redeploy
- **Render**: Dashboard → Service → Manual Deploy
- **Vercel**: Dashboard → Project → Redeploy

### Environment Variables
- **Render**: Settings → Environment Variables
- **Vercel**: Settings → Environment Variables

---

## 🐛 Troubleshooting

### Render Backend Won't Start
```
Error: ModuleNotFoundError
→ Check render.sh runs before start command
→ Ensure requirements.txt is up to date
→ Check Python version (3.11 recommended)
```

### Frontend Can't Connect to Backend
```
Error: CORS blocked
→ Add to backend (main.py):
   from fastapi.middleware.cors import CORSMiddleware
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  # Production: specify domain
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"]
   )
```

### Cold Start Issues
- Render free tier goes to sleep after 15 min inactivity
- Solution: Use paid tier ($7/mo) or add uptime monitoring

---

## 🎯 Next Steps

1. ✅ Create accounts on Render & Vercel
2. ✅ Deploy backend to Render
3. ✅ Deploy frontend to Vercel
4. ✅ Connect frontend to backend
5. ✅ Test in production
6. ✅ (Optional) Add custom domain

**Total setup time**: ~15 minutes
**Cost to start**: $0
**When ready to scale**: $7-27/month

