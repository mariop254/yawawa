# 🚀 Como Iniciar os Servidores

## ⚠️ IMPORTANTE: Você precisa iniciar DOIS servidores!

O sistema precisa de **dois servidores rodando simultaneamente**:

1. **Servidor de Autenticação** (porta 3002) - Valida login
2. **Servidor de Desenvolvimento** (porta 3000) - Serve os arquivos HTML/CSS/JS

## 📋 Método 1: Script Automático (RECOMENDADO)

### Windows (PowerShell):
```powershell
.\start-all.ps1
```

### Windows (CMD):
```cmd
start-all.bat
```

### O que o script faz:
- ✅ Verifica se Node.js está instalado
- ✅ Inicia o servidor de autenticação na porta 3002 (em nova janela)
- ✅ Aguarda o servidor iniciar completamente
- ✅ Inicia o servidor de desenvolvimento na porta 3000
- ✅ Verifica se ambos estão rodando

## 📋 Método 2: Manual (Dois Terminais)

### Terminal 1 - Servidor de Autenticação:
```bash
node simple-auth-server.js
```

Você deve ver:
```
🔐 Dashboard Mpinda Evata - API de Autenticação Simples
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Servidor rodando em: http://localhost:3002
```

### Terminal 2 - Servidor de Desenvolvimento:
```bash
node dev-server.js
```

Você deve ver:
```
🚀 Dashboard Mpinda Evata - Servidor de Desenvolvimento
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Servidor rodando em: http://localhost:3000
```

## ✅ Como Verificar se Está Funcionando

### 1. Verificar Portas:
```bash
# Verificar porta 3002 (autenticação)
netstat -ano | findstr :3002

# Verificar porta 3000 (desenvolvimento)
netstat -ano | findstr :3000
```

### 2. Testar API de Autenticação:
Abra no navegador: `http://localhost:3002/api/auth/status`

Deve retornar:
```json
{
  "status": "online",
  "service": "Mpinda Evata Simple Auth API",
  "version": "1.0.0"
}
```

### 3. Testar Página de Login:
Abra no navegador: `http://localhost:3000/login.html`

Se o servidor de autenticação estiver rodando, a página carregará normalmente.
Se não estiver, você verá um aviso amarelo na página.

## 🔧 Problemas Comuns

### Erro: "Porta 3002 já está em uso"
**Solução:**
```bash
# Encontrar o processo
netstat -ano | findstr :3002

# Parar o processo (substitua PID pelo número)
taskkill /PID <PID> /F
```

### Erro: "Node.js não encontrado"
**Solução:**
1. Instale o Node.js: https://nodejs.org/
2. Reinicie o terminal após instalar
3. Verifique: `node --version`

### Servidor não inicia
**Solução:**
1. Verifique se está no diretório correto do projeto
2. Verifique se o arquivo `simple-auth-server.js` existe
3. Execute: `node --version` para verificar Node.js

## 📝 Checklist Rápido

Antes de tentar fazer login, verifique:

- [ ] Servidor de autenticação rodando (porta 3002)
- [ ] Servidor de desenvolvimento rodando (porta 3000)
- [ ] Acessando `http://localhost:3000/login.html` (não `127.0.0.1`)
- [ ] Nenhum erro no console do navegador (F12)
- [ ] Nenhum erro nos terminais dos servidores

## 🎯 Próximos Passos

Após iniciar os servidores:

1. Acesse: `http://localhost:3000/login.html`
2. Use as credenciais:
   - `admin@mpindaevata.com` / `admin123`
   - `rh@mpindaevata.com` / `rh123`
   - `financeiro@mpindaevata.com` / `fin123`
   - `vendas@mpindaevata.com` / `vendas123`

---

**💡 Dica:** Use o script `start-all.bat` ou `start-all.ps1` para iniciar ambos os servidores automaticamente!

