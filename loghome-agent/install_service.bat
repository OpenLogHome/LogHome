@echo off
echo Installing LogHome Simulator as a Windows Service...

REM Check if NSSM is installed
where nssm >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: NSSM (Non-Sucking Service Manager) is not installed or not in PATH.
    echo Please download NSSM from https://nssm.cc/ and install it first.
    echo After installation, make sure it's in your PATH environment variable.
    pause
    exit /b 1
)

REM Get the current directory
set CURRENT_DIR=%~dp0
set CURRENT_DIR=%CURRENT_DIR:~0,-1%

REM Create logs directory if it doesn't exist
if not exist "%CURRENT_DIR%\logs" mkdir "%CURRENT_DIR%\logs"

REM Install the service
echo Installing LogHome Simulator service...
nssm install LogHomeSimulator "%CURRENT_DIR%\run_forever.bat"
nssm set LogHomeSimulator DisplayName "LogHome Simulator Service"
nssm set LogHomeSimulator Description "LogHome AI Agent Simulator Service"
nssm set LogHomeSimulator AppDirectory "%CURRENT_DIR%"
nssm set LogHomeSimulator AppStdout "%CURRENT_DIR%\logs\service_stdout.log"
nssm set LogHomeSimulator AppStderr "%CURRENT_DIR%\logs\service_stderr.log"
nssm set LogHomeSimulator AppRotateFiles 1
nssm set LogHomeSimulator AppRotateBytes 10485760
nssm set LogHomeSimulator Start SERVICE_AUTO_START
nssm set LogHomeSimulator ObjectName LocalSystem
nssm set LogHomeSimulator Type SERVICE_WIN32_OWN_PROCESS

echo Service installation complete!
echo.
echo To start the service, run: nssm start LogHomeSimulator
echo To stop the service, run: nssm stop LogHomeSimulator
echo To remove the service, run: nssm remove LogHomeSimulator
echo.
echo Would you like to start the service now? (Y/N)
set /p START_SERVICE=

if /i "%START_SERVICE%"=="Y" (
    echo Starting LogHomeSimulator service...
    nssm start LogHomeSimulator
    echo Service started!
) else (
    echo Service installed but not started.
)

pause 