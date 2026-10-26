@echo off
setlocal
chcp 65001 >nul
title LogHome local launcher

set ROOT=%~dp0

echo ============================================
echo  LogHome local services launcher
echo  each service opens in its own window
echo ============================================

rem main backend :9000 (nodemon, auto reload)
start "loghome-backend :9000" cmd /k "cd /d %ROOT%loghome-backend && call npx nodemon main.js"

rem log-defence miniapp :8787
start "log-defence :8787" cmd /k "cd /d %ROOT%loghome-miniapps\log-defence && call npm run dev"

rem log-arena miniapp :8789
start "log-arena :8789" cmd /k "cd /d %ROOT%loghome-miniapps\log-arena && call npm run dev"

rem pc frontend nuxt :3000 (first compile takes about 1 minute)
start "loghome-pc-frontend :3000" cmd /k "cd /d %ROOT%loghome-pc-frontend && call npm run dev"

echo All launched. Close a window to stop that service.
echo Ports: 9000 backend / 8787 defence / 8789 arena / 3000 pc
timeout /t 5 >nul
