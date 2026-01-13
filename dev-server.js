#!/usr/bin/env node

/**
 * Servidor de desenvolvimento para o Dashboard Mpinda Evata
 * Serve arquivos estáticos e fornece live reload básico
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// MIME types para diferentes extensões
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Arquivo não encontrado
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <h1>404 - Arquivo não encontrado</h1>
          <p>O arquivo <code>${filePath}</code> não foi encontrado.</p>
          <p><a href="/">← Voltar ao início</a></p>
        `);
      } else {
        // Erro interno do servidor
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <h1>500 - Erro interno do servidor</h1>
          <p>Erro ao ler o arquivo: ${err.message}</p>
        `);
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType + '; charset=utf-8',
        'Cache-Control': 'no-cache' // Evita cache durante desenvolvimento
      });
      res.end(content);
    }
  });
}

const server = http.createServer((req, res) => {
  // Parse da URL
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;

  // Remove query string e fragmentos
  pathname = pathname.replace(/\?.*$/, '').replace(/#.*$/, '');

  // Previne directory traversal
  pathname = path.normalize(pathname);
  if (pathname.includes('..')) {
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>400 - Requisição inválida</h1>');
    return;
  }

  // Se é a raiz, serve o index.html
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Constrói o caminho do arquivo
  const filePath = path.join(__dirname, pathname);

  // Log da requisição
  console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);

  // Serve o arquivo
  serveFile(filePath, res);
});

server.listen(PORT, HOST, () => {
  console.log('🚀 Dashboard Mpinda Evata - Servidor de Desenvolvimento');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Servidor rodando em: http://${HOST}:${PORT}`);
  console.log(`📁 Servindo arquivos de: ${__dirname}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('💡 Dicas:');
  console.log('   • Acesse http://localhost:3000 para ver o dashboard');
  console.log('   • Pressione Ctrl+C para parar o servidor');
  console.log('   • Arquivos são servidos sem cache para desenvolvimento');
  console.log('');
  
  // Tenta abrir o navegador automaticamente (apenas no Windows)
  if (process.platform === 'win32') {
    const { exec } = require('child_process');
    exec(`start http://${HOST}:${PORT}`, (err) => {
      if (!err) {
        console.log('🌐 Abrindo navegador automaticamente...');
      }
    });
  }
});

// Tratamento de erros
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Erro: Porta ${PORT} já está em uso.`);
    console.error('   Tente usar uma porta diferente:');
    console.error(`   PORT=3001 node dev-server.js`);
  } else {
    console.error('❌ Erro no servidor:', err.message);
  }
  process.exit(1);
});

// Tratamento de sinais para encerramento gracioso
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Recebido SIGTERM, encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso.');
    process.exit(0);
  });
});