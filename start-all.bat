@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Resolve repo root based on this script location
set ROOT=%~dp0
pushd "%ROOT%"

echo [1/3] Ensuring backend deps (pip install -r backend/requirements.txt)
cd /d "%ROOT%backend"
python -m pip install -r requirements.txt >nul 2>&1
if errorlevel 1 (
  echo Failed to install backend dependencies. Check Python/pip installation.
  pause
  goto :eof
)

echo [2/3] Starting backend (FastAPI @ http://127.0.0.1:8000)
REM Run backend in the SAME terminal (no new windows)
start "" /b cmd /c "cd /d %ROOT%backend && python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

echo [3/3] Ensuring frontend deps (npm install)
cd /d "%ROOT%frontend"
call npm install >nul 2>&1

echo Launching frontend (Vite @ http://localhost:5173)
REM Run frontend in the SAME terminal (no new windows)
start "" /b cmd /c "cd /d %ROOT%frontend && npm run dev"

REM Do not auto-open browser to avoid wrong port when occupied
echo Tip: Open your browser to http://localhost:5173/ (or the port Vite prints)

echo All set! Backend and Frontend are starting in this terminal.
echo - Backend: http://127.0.0.1:8000
echo - Frontend: http://localhost:5173/

echo You can close this window.
endlocal
popd
exit /b 0
