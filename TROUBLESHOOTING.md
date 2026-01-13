# 🔧 Guia de Troubleshooting - Sistema de Login

## Problema: Não consigo fazer login

### Passo 1: Verificar se os servidores estão rodando

O sistema precisa de **DOIS servidores** rodando simultaneamente:

1. **Servidor de Autenticação** (porta 3002)
2. **Servidor de Desenvolvimento** (porta 3000)

#### Como verificar:

```bash
# Verificar se a porta 3002 está em uso (servidor de autenticação)
netstat -ano | findstr :3002

# Verificar se a porta 3000 está em uso (servidor de desenvolvimento)
netstat -ano | findstr :3000
```

#### Como iniciar:

```bash
# Opção 1: Script automático (recomendado)
.\start-all.ps1
# ou
start-all.bat

# Opção 2: Manual (dois terminais)
# Terminal 1:
node simple-auth-server.js

# Terminal 2:
node dev-server.js
```

### Passo 2: Testar a API diretamente

Acesse: `http://localhost:3000/test-login.html`

Esta página permite:
- Verificar se o servidor está online
- Testar login individual
- Testar todas as credenciais de uma vez

### Passo 3: Verificar credenciais

**Credenciais corretas:**

```
admin@mpindaevata.com / admin123
rh@mpindaevata.com / rh123
financeiro@mpindaevata.com / fin123
vendas@mpindaevata.com / vendas123
```

**Importante:**
- O email é case-insensitive (não diferencia maiúsculas/minúsculas)
- Espaços extras são removidos automaticamente
- A senha é case-sensitive (diferencia maiúsculas/minúsculas)

### Passo 4: Verificar logs

#### No servidor de autenticação (porta 3002):
Você deve ver logs como:
```
[LOGIN] Tentativa de login - Email: admin@mpindaevata.com
[LOGIN] Email normalizado: admin@mpindaevata.com
[LOGIN] Usuário encontrado: Sim
[LOGIN] Senhas correspondem: true
[LOGIN] Sucesso! Usuário: Administrador
```

#### No navegador (Console F12):
Você deve ver logs como:
```
[LOGIN] Tentando autenticar: admin@mpindaevata.com
[LOGIN] URL da API: http://localhost:3002/api/auth/login
[LOGIN] Status da resposta: 200
[LOGIN] Status OK: true
[LOGIN] Sessão armazenada com sucesso
```

### Passo 5: Problemas comuns

#### Erro: "Erro de conexão com o servidor"
- **Causa**: Servidor de autenticação não está rodando
- **Solução**: Execute `node simple-auth-server.js` na porta 3002

#### Erro: "Credenciais inválidas"
- **Causa 1**: Email ou senha incorretos
- **Solução**: Verifique se está usando as credenciais corretas (veja Passo 3)

- **Causa 2**: Email com espaços ou maiúsculas
- **Solução**: O sistema normaliza automaticamente, mas tente: `admin@mpindaevata.com` (tudo minúsculo)

#### Erro: "Porta 3002 já está em uso"
- **Causa**: Outro processo está usando a porta
- **Solução**: 
  ```bash
  # Encontrar o processo
  netstat -ano | findstr :3002
  
  # Parar o processo (substitua PID pelo número encontrado)
  taskkill /PID <PID> /F
  ```

#### Erro: CORS (Cross-Origin Resource Sharing)
- **Causa**: Problema de configuração CORS
- **Solução**: O servidor já está configurado com CORS. Se persistir, verifique se está acessando de `localhost` e não de `127.0.0.1`

### Passo 6: Testar manualmente com cURL

```bash
# Testar status
curl http://localhost:3002/api/auth/status

# Testar login
curl -X POST http://localhost:3002/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@mpindaevata.com\",\"password\":\"admin123\"}"
```

### Passo 7: Limpar cache e sessões

Se ainda não funcionar, limpe o cache do navegador:

1. Abra o Console (F12)
2. Vá em "Application" (Chrome) ou "Storage" (Firefox)
3. Limpe:
   - Local Storage
   - Session Storage
   - Cookies

Ou execute no Console:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## Verificação Rápida

Execute este checklist:

- [ ] Servidor de autenticação rodando na porta 3002
- [ ] Servidor de desenvolvimento rodando na porta 3000
- [ ] Acessando `http://localhost:3000/login.html` (não `127.0.0.1`)
- [ ] Credenciais corretas (ver Passo 3)
- [ ] Console do navegador sem erros (F12)
- [ ] Logs do servidor mostrando tentativas de login

## Ainda não funciona?

1. Abra `test-login.html` e execute todos os testes
2. Verifique os logs no servidor e no navegador
3. Certifique-se de que ambos os servidores estão rodando
4. Tente em outro navegador (Chrome, Firefox, Edge)

---

**Última atualização**: Após correção das senhas e adição de logs detalhados

