@echo off
echo ========================================
echo Starting Dev Buddy
echo ========================================
echo.

echo [1/4] Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Backend npm install failed
    pause
    exit /b 1
)

echo.
echo [2/4] Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ERROR: Frontend npm install failed
    pause
    exit /b 1
)

echo.
echo [3/4] Starting backend server...
cd ..\backend
start "Dev Buddy Backend" cmd /k "npm start"
timeout /t 5

echo.
echo [4/4] Starting frontend...
cd ..\frontend
start "Dev Buddy Frontend" cmd /k "npm start"

echo.
echo ========================================
echo Dev Buddy is starting!
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo The browser will open automatically in a few seconds...
echo.
echo Press any key to exit this window (servers will keep running)
pause

@REM Made with Bob
