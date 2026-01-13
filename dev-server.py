#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Servidor de desenvolvimento para o Dashboard Mpinda Evata
Serve arquivos estáticos com suporte a CORS e live reload básico
"""

import http.server
import socketserver
import os
import sys
import webbrowser
import threading
import time
from urllib.parse import urlparse

PORT = int(os.environ.get('PORT', 3000))
HOST = os.environ.get('HOST', 'localhost')

class DashboardHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Handler customizado para o servidor de desenvolvimento"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        # Adiciona headers para desenvolvimento
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Log customizado com timestamp
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        sys.stdout.write(f"{timestamp} - {format % args}\n")
    
    def do_GET(self):
        # Se é a raiz, redireciona para index.html
        if self.path == '/':
            self.path = '/index.html'
        
        # Previne directory traversal
        parsed_path = urlparse(self.path)
        if '..' in parsed_path.path:
            self.send_error(400, "Requisição inválida")
            return
        
        return super().do_GET()

def open_browser():
    """Abre o navegador após um pequeno delay"""
    time.sleep(1)
    try:
        webbrowser.open(f'http://{HOST}:{PORT}')
        print(f"🌐 Abrindo navegador automaticamente...")
    except Exception as e:
        print(f"⚠️  Não foi possível abrir o navegador automaticamente: {e}")

def main():
    """Função principal do servidor"""
    try:
        # Configura o servidor
        with socketserver.TCPServer((HOST, PORT), DashboardHTTPRequestHandler) as httpd:
            print('🚀 Dashboard Mpinda Evata - Servidor de Desenvolvimento')
            print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            print(f'📍 Servidor rodando em: http://{HOST}:{PORT}')
            print(f'📁 Servindo arquivos de: {os.getcwd()}')
            print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            print('')
            print('💡 Dicas:')
            print('   • Acesse http://localhost:3000 para ver o dashboard')
            print('   • Pressione Ctrl+C para parar o servidor')
            print('   • Arquivos são servidos sem cache para desenvolvimento')
            print('')
            
            # Abre o navegador em uma thread separada
            browser_thread = threading.Thread(target=open_browser)
            browser_thread.daemon = True
            browser_thread.start()
            
            # Inicia o servidor
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 98 or 'Address already in use' in str(e):
            print(f"❌ Erro: Porta {PORT} já está em uso.")
            print("   Tente usar uma porta diferente:")
            print(f"   PORT=3001 python dev-server.py")
        else:
            print(f"❌ Erro no servidor: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print('\n🛑 Encerrando servidor...')
        print('✅ Servidor encerrado com sucesso.')
        sys.exit(0)

if __name__ == '__main__':
    main()