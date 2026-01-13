# Dashboard Mpinda Evata - Servidor de Desenvolvimento PowerShell
# Servidor HTTP simples usando PowerShell nativo

param(
    [int]$Port = 3000,
    [string]$ServerHost = "localhost"
)

Write-Host "🚀 Dashboard Mpinda Evata - Servidor de Desenvolvimento" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📍 Servidor rodando em: http://$ServerHost`:$Port" -ForegroundColor Green
Write-Host "📁 Servindo arquivos de: $PWD" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Dicas:" -ForegroundColor White
Write-Host "   • Acesse http://localhost:$Port para ver o dashboard" -ForegroundColor Gray
Write-Host "   • Pressione Ctrl+C para parar o servidor" -ForegroundColor Gray
Write-Host "   • Arquivos HTML, CSS e JS são servidos automaticamente" -ForegroundColor Gray
Write-Host ""

# Função para obter MIME type
function Get-MimeType {
    param([string]$Extension)
    
    switch ($Extension.ToLower()) {
        ".html" { return "text/html; charset=utf-8" }
        ".css"  { return "text/css; charset=utf-8" }
        ".js"   { return "application/javascript; charset=utf-8" }
        ".json" { return "application/json; charset=utf-8" }
        ".png"  { return "image/png" }
        ".jpg"  { return "image/jpeg" }
        ".jpeg" { return "image/jpeg" }
        ".gif"  { return "image/gif" }
        ".svg"  { return "image/svg+xml" }
        ".ico"  { return "image/x-icon" }
        default { return "text/plain; charset=utf-8" }
    }
}

# Função para servir arquivo
function Serve-File {
    param(
        [string]$FilePath,
        [System.Net.HttpListenerResponse]$Response
    )
    
    if (Test-Path $FilePath -PathType Leaf) {
        try {
            $content = [System.IO.File]::ReadAllBytes($FilePath)
            $extension = [System.IO.Path]::GetExtension($FilePath)
            $mimeType = Get-MimeType $extension
            
            $Response.ContentType = $mimeType
            $Response.ContentLength64 = $content.Length
            $Response.Headers.Add("Cache-Control", "no-cache")
            $Response.StatusCode = 200
            
            $Response.OutputStream.Write($content, 0, $content.Length)
            $Response.OutputStream.Close()
            
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            Write-Host "$timestamp - 200 GET $FilePath" -ForegroundColor Green
        }
        catch {
            Write-Host "Erro ao servir arquivo $FilePath`: $($_.Exception.Message)" -ForegroundColor Red
            $Response.StatusCode = 500
            $Response.Close()
        }
    }
    else {
        # Arquivo não encontrado
        $Response.StatusCode = 404
        $Response.ContentType = "text/html; charset=utf-8"
        
        $html404 = @"
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Arquivo não encontrado</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #e74c3c; margin-bottom: 20px; }
        p { color: #666; line-height: 1.6; }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
        code { background: #f8f9fa; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
    </style>
</head>
<body>
    <div class="container">
        <h1>404 - Arquivo não encontrado</h1>
        <p>O arquivo <code>$FilePath</code> não foi encontrado no servidor.</p>
        <p><a href="/">← Voltar ao dashboard</a></p>
    </div>
</body>
</html>
"@
        
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($html404)
        $Response.ContentLength64 = $bytes.Length
        $Response.OutputStream.Write($bytes, 0, $bytes.Length)
        $Response.OutputStream.Close()
        
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Write-Host "$timestamp - 404 GET $FilePath" -ForegroundColor Yellow
    }
}

try {
    # Cria o listener HTTP
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://$ServerHost`:$Port/")
    $listener.Start()
    
    Write-Host "✅ Servidor iniciado com sucesso!" -ForegroundColor Green
    Write-Host ""
    
    # Tenta abrir o navegador
    try {
        Start-Process "http://$ServerHost`:$Port"
        Write-Host "🌐 Abrindo navegador automaticamente..." -ForegroundColor Cyan
    }
    catch {
        Write-Host "⚠️  Não foi possível abrir o navegador automaticamente" -ForegroundColor Yellow
    }
    
    Write-Host "🔄 Aguardando requisições... (Ctrl+C para parar)" -ForegroundColor White
    Write-Host ""
    
    # Loop principal do servidor
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            # Parse da URL
            $url = $request.Url.LocalPath
            
            # Se é a raiz, serve index.html
            if ($url -eq "/" -or $url -eq "") {
                $url = "/index.html"
            }
            
            # Remove query string
            $url = $url -split '\?' | Select-Object -First 1
            
            # Previne directory traversal
            if ($url -match '\.\.') {
                $response.StatusCode = 400
                $response.Close()
                continue
            }
            
            # Constrói o caminho do arquivo
            $filePath = Join-Path $PWD ($url.TrimStart('/'))
            
            # Serve o arquivo
            Serve-File -FilePath $filePath -Response $response
        }
        catch [System.Net.HttpListenerException] {
            # Listener foi parado
            break
        }
        catch {
            Write-Host "Erro no servidor: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}
catch {
    if ($_.Exception.Message -match "access is denied" -or $_.Exception.Message -match "acesso negado") {
        Write-Host "❌ Erro: Acesso negado. Tente executar como Administrador ou use uma porta diferente." -ForegroundColor Red
        Write-Host "   Exemplo: .\start-dev.ps1 -Port 8080" -ForegroundColor Yellow
    }
    elseif ($_.Exception.Message -match "already in use" -or $_.Exception.Message -match "já está sendo usado") {
        Write-Host "❌ Erro: Porta $Port já está em uso." -ForegroundColor Red
        Write-Host "   Tente uma porta diferente: .\start-dev.ps1 -Port 8080" -ForegroundColor Yellow
    }
    else {
        Write-Host "❌ Erro ao iniciar servidor: $($_.Exception.Message)" -ForegroundColor Red
    }
}
finally {
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
        Write-Host ""
        Write-Host "🛑 Servidor encerrado." -ForegroundColor Yellow
    }
}