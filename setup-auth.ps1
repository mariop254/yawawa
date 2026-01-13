# Setup da API de Autenticação - Dashboard Mpinda Evata
# Script para configurar e iniciar o sistema de autenticação

Write-Host "🔐 Setup da API de Autenticação - Dashboard Mpinda Evata" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Verificar se Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Por favor, instale Node.js 14+ e tente novamente." -ForegroundColor Red
    Write-Host "   Download: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar se npm está disponível
try {
    $npmVersion = npm --version
    Write-Host "✅ NPM encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ NPM não encontrado." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Instalando dependências da API de autenticação..." -ForegroundColor Yellow

# Instalar dependências
$dependencies = @(
    "express@^4.18.2",
    "sqlite3@^5.1.6", 
    "bcrypt@^5.1.1",
    "jsonwebtoken@^9.0.2",
    "express-rate-limit@^7.1.5",
    "cors@^2.8.5"
)

foreach ($dep in $dependencies) {
    Write-Host "   Instalando $dep..." -ForegroundColor Gray
    npm install $dep --save 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ $dep instalado" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Erro ao instalar $dep" -ForegroundColor Red
    }
}

# Instalar nodemon para desenvolvimento (opcional)
Write-Host "   Instalando nodemon (desenvolvimento)..." -ForegroundColor Gray
npm install nodemon@^3.0.1 --save-dev 2>$null

Write-Host ""
Write-Host "🗄️  Configurando banco de dados..." -ForegroundColor Yellow

# Verificar se arquivos necessários existem
$requiredFiles = @(
    "database-auth-schema.sql",
    "auth-api.js"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file encontrado" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file não encontrado" -ForegroundColor Red
        Write-Host "      Certifique-se de que todos os arquivos foram criados corretamente." -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "🚀 Iniciando API de autenticação..." -ForegroundColor Yellow
Write-Host ""

# Iniciar a API
try {
    Write-Host "📍 A API será iniciada em http://localhost:3002" -ForegroundColor Cyan
    Write-Host "🔑 Credenciais padrão:" -ForegroundColor Cyan
    Write-Host "   Email: admin@mpindaevata.com" -ForegroundColor White
    Write-Host "   Senha: admin123" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Para parar o servidor, pressione Ctrl+C" -ForegroundColor Gray
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    
    # Executar a API
    node auth-api.js
    
} catch {
    Write-Host "❌ Erro ao iniciar a API: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Soluções possíveis:" -ForegroundColor Yellow
    Write-Host "   1. Verifique se a porta 3002 está disponível" -ForegroundColor Gray
    Write-Host "   2. Certifique-se de que todas as dependências foram instaladas" -ForegroundColor Gray
    Write-Host "   3. Verifique os logs de erro acima" -ForegroundColor Gray
    exit 1
}