@echo off
echo 🚀 Iniciando Dashboard Mpinda Evata...
echo.

REM Verifica se Python está disponível
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python não encontrado. Tentando python3...
    python3 --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Python não está instalado ou não está no PATH.
        echo    Por favor, instale Python 3.6+ e tente novamente.
        pause
        exit /b 1
    ) else (
        python3 dev-server.py
    )
) else (
    python dev-server.py
)

pause