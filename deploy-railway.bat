@echo off
REM Railway Deployment Script for Windows
REM Deploys Career Path Navigator to Railway.app

echo.
echo 🚂 Career Path Navigator - Railway Deployment
echo =============================================
echo.

REM Check if Railway CLI is installed
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing Railway CLI...
    call npm install -g @railway/cli
)

echo 1️⃣  Logging in to Railway...
call railway login

echo.
echo 2️⃣  Linking project...
call railway link --project Career-path-Navigator

echo.
echo 3️⃣  Setting environment variables...
call railway variables set PYTHONUNBUFFERED=1
call railway variables set PORT=8000

echo.
echo 4️⃣  Building and deploying...
call railway up --detach

echo.
echo ✅ Deployment started!
echo.
echo Getting live URL...
call railway domain

echo.
echo 🎉 Career Path Navigator is now live on Railway!
echo.
echo 📊 Dashboard: https://railway.app/dashboard
echo 📖 Docs: https://docs.railway.app
echo.
echo Test your deployment:
echo Backend: https://^<your-domain^>/streams?class=10
echo Frontend: https://^<your-domain^>/
