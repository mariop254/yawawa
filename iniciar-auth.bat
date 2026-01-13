@echo off
title Servidor de Autenticação - Porta 3002
color 0A

echo.
echo ════════════════════════════════════════════════════════════
echo    SERVIDOR DE AUTENTICAÇÃO - Dashboard Mpinda Evata
echo ════════════════════════════════════════════════════════════
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo.
    echo Por favor, instale o Node.js primeiro:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo.
echo 🔄 Iniciando servidor de autenticação na porta 3002...
echo.
echo ════════════════════════════════════════════════════════════
echo.

node simple-auth-server.js

pause

