@echo off
title 🚀 Starting Localhost Dev Server + Ngrok Tunnel

REM STEP 1: Start React/Vite/Node frontend (localhost:3000)
echo 🧪 Launching localhost on http://localhost:3000...
start "" cmd /k "npm start"

REM STEP 2: Give it a few seconds to spin up (adjust if needed)
timeout /t 8 > nul

REM STEP 3: Run Ngrok to expose localhost:3000
echo 🌐 Starting Ngrok tunnel for localhost:3000...
start "" cmd /k "ngrok http 3000"

REM Final info
echo.
echo ------------------------------------------------
echo ✅ Your site is now live:
echo    • Local: http://localhost:3000
echo    • Public: [Check Ngrok window for the URL]
echo 📱 Open the public URL on your iPhone to test!
echo ------------------------------------------------
pause
