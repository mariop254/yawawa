@echo off
echo 🚀 Dashboard Mpinda Evata - Iniciando Servidores
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Por favor, instale o Node.js primeiro.
    echo    Download: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo.
echo 🔄 Iniciando servidores...
echo.

REM Verificar se a porta 3002 já está em uso
netstat -ano | findstr :3002 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Porta 3002 já está em uso.
    echo    Se for o servidor de autenticação, está tudo certo!
    echo    Caso contrário, feche a janela e execute novamente.
    echo.
    timeout /t 3 /nobreak >nul
) else (
    REM Iniciar servidor de autenticação em nova janela
    echo 🔄 Iniciando servidor de autenticação na porta 3002...
    start "Servidor de Autenticação (Porta 3002)" cmd /k "node simple-auth-server.js"
    
    REM Aguardar o servidor iniciar
    echo ⏳ Aguardando servidor iniciar (5 segundos)...
    timeout /t 5 /nobreak >nul
    echo ✅ Servidor de autenticação deve estar online!
    echo.
)

:start_dev

REM Iniciar servidor de desenvolvimento na janela atual
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✅ Ambos os servidores estão sendo iniciados!
echo.
echo 📍 Servidores:
echo    • Desenvolvimento: http://localhost:3000
echo    • Autenticação: http://localhost:3002
echo.
echo 🔒 Credenciais de teste:
echo    • admin@mpindaevata.com / admin123
echo    • rh@mpindaevata.com / rh123
echo    • financeiro@mpindaevata.com / fin123
echo    • vendas@mpindaevata.com / vendas123
echo.
echo 💡 Acesse: http://localhost:3000/login.html
echo.
echo ⚠️  Para parar os servidores, feche as janelas do CMD
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

node dev-server.js

