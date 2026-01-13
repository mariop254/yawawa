# Dashboard Mpinda Evata - Iniciar Todos os Servidores
# Inicia o servidor de desenvolvimento (porta 3000) e o servidor de autenticação (porta 3002)

Write-Host "🚀 Dashboard Mpinda Evata - Iniciando Servidores" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Verificar se Node.js está instalado
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js não encontrado. Por favor, instale o Node.js primeiro." -ForegroundColor Red
    Write-Host "   Download: https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Função para iniciar servidor em nova janela
function Start-ServerInNewWindow {
    param(
        [string]$ScriptPath,
        [string]$ServerName,
        [string]$Port
    )
    
    Write-Host "🔄 Iniciando $ServerName na porta $Port..." -ForegroundColor Yellow
    
    # Criar um script temporário para executar o servidor
    $tempScript = [System.IO.Path]::GetTempFileName() + ".ps1"
    $scriptContent = @"
Write-Host "🚀 $ServerName - Porta $Port" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
node `"$ScriptPath`"
"@
    
    Set-Content -Path $tempScript -Value $scriptContent
    
    # Iniciar em nova janela do PowerShell
    Start-Process powershell.exe -ArgumentList "-NoExit", "-File", "`"$tempScript`""
    
    Start-Sleep -Seconds 2
}

# Iniciar servidor de autenticação (porta 3002)
$authServerPath = Join-Path $PSScriptRoot "simple-auth-server.js"
if (Test-Path $authServerPath) {
    Start-ServerInNewWindow -ScriptPath $authServerPath -ServerName "Servidor de Autenticação" -Port "3002"
} else {
    Write-Host "❌ Arquivo simple-auth-server.js não encontrado!" -ForegroundColor Red
    pause
    exit 1
}

# Aguardar um pouco antes de iniciar o próximo servidor
Start-Sleep -Seconds 3

# Iniciar servidor de desenvolvimento (porta 3000)
$devServerPath = Join-Path $PSScriptRoot "dev-server.js"
if (Test-Path $devServerPath) {
    Write-Host "🔄 Iniciando Servidor de Desenvolvimento na porta 3000..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "✅ Ambos os servidores estão sendo iniciados!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Servidores:" -ForegroundColor White
    Write-Host "   • Desenvolvimento: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "   • Autenticação: http://localhost:3002" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔒 Credenciais de teste:" -ForegroundColor White
    Write-Host "   • admin@mpindaevata.com / admin123" -ForegroundColor Yellow
    Write-Host "   • rh@mpindaevata.com / rh123" -ForegroundColor Yellow
    Write-Host "   • financeiro@mpindaevata.com / fin123" -ForegroundColor Yellow
    Write-Host "   • vendas@mpindaevata.com / vendas123" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Acesse: http://localhost:3000/login.html" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  Para parar os servidores, feche as janelas do PowerShell" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
    
    # Iniciar servidor de desenvolvimento na janela atual
    node $devServerPath
} else {
    Write-Host "❌ Arquivo dev-server.js não encontrado!" -ForegroundColor Red
    Write-Host "⚠️  Servidor de autenticação já está rodando. Use Ctrl+C para parar." -ForegroundColor Yellow
    pause
}

