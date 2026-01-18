# ⚡ Quick Deployment Steps: Render + Vercel

## 🎯 10-Minute Deployment

### Backend Setup (Render)
```bash
# 1. Go to https://render.com
# 2. Click "New +" → "Web Service"
# 3. Connect to GitHub (select Career-path-Navigator)
# 4. Fill form:
#    Name: career-navigator-backend
#    Root Directory: backend
#    Build: pip install -r requirements.txt
#    Start: uvicorn main:app --host 0.0.0.0 --port 8000
# 5. Deploy → Done! (3-5 min)

# Get URL: https://career-navigator-backend.onrender.com
```

### Frontend Setup (Vercel)
```bash
# 1. Go to https://vercel.com
# 2. Click "Add New" → "Project"
# 3. Import Career-path-Navigator repo
# 4. Settings:
#    Framework: Vite
#    Root: frontend
#    Build: npm run build
#    Install: npm install
# 5. Add Env Var:
#    VITE_API_URL = https://career-navigator-backend.onrender.com
# 6. Deploy → Done! (2-3 min)

# Get URL: https://career-path-navigator.vercel.app
```

---

## ✅ After Deployment

1. **Test Backend**: Visit `https://career-navigator-backend.onrender.com/streams`
2. **Test Frontend**: Visit `https://career-path-navigator.vercel.app`
3. **Check Console**: Browser DevTools → Network tab for API calls

---

## 🔄 Auto-Deployment

Both services auto-deploy on `git push` to main:
```bash
git add .
git commit -m "Update deployment configs"
git push origin main
# Auto-deploys to both services!
```

---

## 💰 Cost
- **Free Tier**: $0/month (cold starts after 15 min)
- **Paid Tier**: $7-27/month (always running)

---

## 🆘 Common Issues

**Render cold start?** → Normal on free tier. Upgrade to Starter ($7/mo) to keep warm.

**CORS error?** → Backend updated ✓ Redeploy with `git push`

**API not connecting?** → Check env var `VITE_API_URL` in Vercel settings

**502 Bad Gateway?** → Render might be building. Wait 2 min and refresh.

