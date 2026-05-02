@echo off
echo.
echo ========================================
echo   Opening Dev Buddy Frontend
echo ========================================
echo.
echo Backend should be running on port 3001
echo.
echo Opening frontend in your default browser...
echo.

start "" "%CD%\frontend\index-simple.html"

echo.
echo Frontend opened!
echo.
echo If you see API errors:
echo 1. Make sure backend is running (npm start in backend folder)
echo 2. Check that USE_MOCK=true in backend/.env
echo.
pause

@REM Made with Bob
