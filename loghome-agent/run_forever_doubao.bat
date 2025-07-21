@echo off
echo Starting LogHome Simulator in forever mode...
cd /d %~dp0
if not exist logs mkdir logs

:loop
python simulator_doubao.py --forever
echo Simulator exited with code %errorlevel%
echo Restarting in 3 seconds...
timeout /t 3 /nobreak > nul
goto loop 