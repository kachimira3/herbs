@echo off
chcp 65001 >nul
title 本草集·本地服务

echo.
echo  ==============================
echo    🌿 本草集 · 中药材辨别网站
echo  ==============================
echo.

REM 获取本机 IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do set IP=%%a
set IP=%IP: =%

echo   📡 本机打开：http://127.0.0.1:8080
echo   📱 手机/其他设备打开：http://%IP%:8080
echo.
echo   按 Ctrl+C 停止服务
echo  ==============================
echo.

REM 用 Python 内置模块起 HTTP 服务（不需要装任何东西）
python -m http.server 8080 --directory "%~dp0"
pause
