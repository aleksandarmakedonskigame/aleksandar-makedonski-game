@echo off
chcp 65001 >nul
title ALEKSANDAR MAKEDONSKI - Pushtanje
color 0E

echo.
echo ===============================================
echo   👑 МИСИЈА НА АЛЕКСАНДАР v5.0
echo   Патот на Светлината
echo ===============================================
echo.
echo Барам начин да стартувам сервер за играта...
echo.

cd /d "%~dp0"

REM === Try Python 3 first ===
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Python е најден! Стартувам сервер...
    echo.
    echo ===============================================
    echo   ИГРАТА Е НА: http://localhost:8000
    echo   За да ја затвориш, притисни Ctrl+C
    echo ===============================================
    echo.
    start http://localhost:8000
    python -m http.server 8000
    goto :end
)

REM === Try py launcher (Windows Python alternative) ===
py --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Python (py) е најден! Стартувам сервер...
    echo.
    start http://localhost:8000
    py -m http.server 8000
    goto :end
)

REM === Try Node.js ===
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Node.js е најден! Стартувам сервер...
    echo.
    start http://localhost:8000
    npx --yes http-server -p 8000 -o
    goto :end
)

REM === Try PHP ===
php --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ PHP е најден! Стартувам сервер...
    echo.
    start http://localhost:8000
    php -S localhost:8000
    goto :end
)

REM === Nothing found ===
echo.
echo ===============================================
echo   ⚠️  ВНИМАНИЕ!
echo ===============================================
echo.
echo На твојот компјутер нема инсталирано:
echo   - Python
echo   - Node.js
echo   - PHP
echo.
echo РЕШЕНИЈА (избери едно):
echo.
echo   1. Инсталирај Python (5 мин):
echo      https://www.python.org/downloads/
echo      ВАЖНО: Чекни "Add Python to PATH" при инсталација!
echo.
echo   2. Качи ја играта на GitHub Pages (БЕСПЛАТНО):
echo      - Прочитај README.md за упатства
echo      - Играта ќе работи од било кој browser
echo.
echo   3. Користи онлајн алатка:
echo      - Отвори https://app.netlify.com/drop
echo      - Drag-and-drop ја целата папка
echo      - Готово, играта е онлајн!
echo.
echo ⚠️  НЕ ОТВАРАЈ ja index.html ДИРЕКТНО -
echo     browser-от блокира CDN-ите од file:// протокол!
echo.
pause

:end
