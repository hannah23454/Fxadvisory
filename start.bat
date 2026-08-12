@echo off
echo Starting SwitchYard FX...
start "Next.js App" cmd /k "pnpm dev"
timeout /t 5 /nobreak >nul
start "ZoomInfo Sync" cmd /k "node scripts/zoominfo-cron.js"
echo.
echo Both servers started!
echo - App:  http://localhost:3000
echo - Sync: running in background window
