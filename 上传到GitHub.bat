@echo off
title Upload herbs to GitHub
cd /d "%~dp0"

set "GIT=C:\Program Files\Git\cmd\git.exe"

echo.
echo ============================================
echo   Uploading project to GitHub...
echo ============================================
echo.

if not exist "%GIT%" (
  echo [ERROR] Git not found.
  goto end
)

"%GIT%" push -u origin main

echo.
if errorlevel 1 goto failed

echo ============================================
echo   [OK] Upload SUCCESS!
echo.
echo   Next: open this URL in your browser
echo   https://github.com/kachimira3/herbs/settings/pages
echo.
echo   Set Branch = main, then click Save
echo ============================================
goto end

:failed

echo ============================================
echo   [FAILED] Upload failed.
echo   Please screenshot this window and send it.
echo ============================================

:end
echo.
pause
