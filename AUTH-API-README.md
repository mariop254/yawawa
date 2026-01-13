# API de Autenticação - Dashboard Mpinda Evata

## 🔐 Visão Geral

API completa de autenticação com banco de dados SQLite, JWT tokens, bcrypt para senhas e sistema de sessões seguro.

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 14+ instalado
- NPM ou Yarn

### Instalação Automática
```bash
# Executar script de setup (Windows)
.\setup-auth.ps1

# Ou instalação manual
npm install express sqlite3 bcrypt jsonwebtoken express-rate-limit cors
node auth-api.js
```

### Instalação Manual
```bash
# 1. Instalar dependências
npm install express sqlite3 bcrypt jsonwebtoken express-rate-limit cors

# 2. Iniciar API
node auth-api.js
```

## 📊 Endpoints da API

### Autenticação

#### POST /api/auth/login
Realizar login no sistema.

**Request:**
```json
{
  "email": "admin@mpindaevata.com",
  "password": "admin123",
  "remember": false
}
```

**Response (Sucesso):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@mpindaevata.com",
    "role": "admin"
  },
  "tokens": {
    "accessToken": "jwt_token_here",
    "sessionToken": "session_token_here"
  },
  "expiresAt": "2024-01-16T10:30:00.000Z"
}
```

#### POST /api/auth/logout
Realizar logout e invalidar sessão.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "sessionToken": "session_token_here"
}
```

#### POST /api/auth/verify-session
Verificar se uma sessão é válida.

**Request:**
```json
{
  "sessionToken": "session_token_here"
}
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@mpindaevata.com",
    "role": "admin"
  }
}
```

#### POST /api/auth/forgot-password
Solicitar recuperação de senha.

**Request:**
```json
{
  "email": "admin@mpindaevata.com"
}
```

### Administração (Requer role 'admin')

#### GET /api/auth/users
Listar todos os usuários.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

#### GET /api/auth/logs?limit=50
Visualizar logs de autenticação.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

### Status

#### GET /api/auth/status
Verificar status da API.

## 🔑 Usuários Padrão

Todos os usuários têm a senha padrão: **admin123**

| Email | Role | Nome |
|-------|------|------|
| admin@mpindaevata.com | admin | Administrador |
| rh@mpindaevata.com | rh | Gestor RH |
| financeiro@mpindaevata.com | financeiro | Analista Financeiro |
| vendas@mpindaevata.com | vendas | Gerente Vendas |
| joao@mpindaevata.com | user | João Silva |
| maria@mpindaevata.com | user | Maria Santos |

## 🛡️ Recursos de Segurança

### Proteção de Senhas
- **bcrypt** com salt rounds 12
- **Hashing seguro** de todas as senhas
- **Salt único** para cada usuário

### Controle de Tentativas
- **Máximo 5 tentativas** de login por usuário
- **Bloqueio temporário** de 15 minutos após exceder
- **Rate limiting** de 5 tentativas por IP em 15 minutos

### Tokens e Sessões
- **JWT tokens** com expiração de 24 horas
- **Session tokens** únicos para cada login
- **Invalidação automática** de sessões expiradas
- **Logout seguro** com invalidação de tokens

### Logs de Auditoria
- **Registro completo** de todas as tentativas de login
- **IP address** e User-Agent tracking
- **Logs de ações** (login_sucesso, login_falha, logout)
- **Detalhes de falhas** para análise de segurança

## 🗄️ Estrutura do Banco

### Tabelas Principais

#### usuarios
- Dados dos usuários e credenciais
- Controle de tentativas e bloqueios
- Roles e permissões

#### sessoes
- Tokens de sessão ativos
- Controle de expiração
- Rastreamento de IP e User-Agent

#### logs_autenticacao
- Auditoria completa de acessos
- Histórico de tentativas
- Análise de segurança

#### tokens_recuperacao
- Tokens para recuperação de senha
- Controle de expiração e uso

## 🔧 Configurações

### Variáveis de Ambiente
```bash
# Porta da API (padrão: 3002)
PORT=3002

# Chave secreta JWT (recomendado alterar em produção)
JWT_SECRET=mpinda_evata_secret_key_2024
```

### Configurações de Segurança
```javascript
// Em auth-api.js
const SALT_ROUNDS = 12;                    // Rounds do bcrypt
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas
const MAX_LOGIN_ATTEMPTS = 5;              // Máx tentativas
const LOCKOUT_DURATION = 15 * 60 * 1000;   // 15 min bloqueio
```

## 🔄 Integração com Frontend

### Atualização do Login
O `login-script.js` foi atualizado para usar a API real:

```javascript
// Configuração da API
const CONFIG = {
    apiUrl: 'http://localhost:3002/api/auth',
    redirectUrl: 'index.html'
};

// Login via API
const result = await validateCredentials(email, password, remember);
```

### Proteção do Dashboard
O `auth-guard.js` verifica sessões via API:

```javascript
// Verificação de sessão
const isValid = await isSessionValid(session);

// Logout via API
await performLogout();
```

## 📱 Testando a API

### Usando curl
```bash
# Login
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mpindaevata.com","password":"admin123"}'

# Verificar status
curl http://localhost:3002/api/auth/status

# Logout
curl -X POST http://localhost:3002/api/auth/logout \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionToken":"SESSION_TOKEN"}'
```

### Usando Postman
1. **POST** `http://localhost:3002/api/auth/login`
2. **Headers**: `Content-Type: application/json`
3. **Body**: `{"email":"admin@mpindaevata.com","password":"admin123"}`

## 🚀 Deployment

### Desenvolvimento
```bash
# Com nodemon (auto-reload)
npm install -g nodemon
nodemon auth-api.js

# Ou normal
node auth-api.js
```

### Produção
1. **Alterar JWT_SECRET** para valor seguro
2. **Configurar HTTPS**
3. **Usar PostgreSQL** ao invés de SQLite
4. **Configurar logs externos**
5. **Implementar backup automático**

## 🔍 Monitoramento

### Logs da API
A API registra logs detalhados no console:
- Inicialização do banco
- Tentativas de login
- Erros de autenticação
- Limpeza de sessões

### Logs de Auditoria
Acesse via endpoint `/api/auth/logs` (admin):
- Histórico completo de acessos
- Análise de tentativas de invasão
- Padrões de uso do sistema

## 🛠️ Troubleshooting

### Problemas Comuns

#### Erro: "Cannot find module 'bcrypt'"
```bash
# Reinstalar bcrypt
npm uninstall bcrypt
npm install bcrypt
```

#### Erro: "Port 3002 already in use"
```bash
# Usar porta diferente
PORT=3003 node auth-api.js
```

#### Erro: "Database locked"
```bash
# Parar todos os processos Node.js
pkill node
# Reiniciar API
node auth-api.js
```

### Debug Mode
```bash
# Executar com logs detalhados
DEBUG=* node auth-api.js
```

## 📞 Suporte

### Logs de Debug
- Console da API mostra todas as operações
- Banco `auth.db` pode ser inspecionado com SQLite Browser
- Logs de autenticação na tabela `logs_autenticacao`

### Comandos Úteis
```bash
# Verificar usuários no banco
sqlite3 auth.db "SELECT * FROM usuarios;"

# Ver sessões ativas
sqlite3 auth.db "SELECT * FROM sessoes WHERE ativo = 1;"

# Logs recentes
sqlite3 auth.db "SELECT * FROM logs_autenticacao ORDER BY created_at DESC LIMIT 10;"
```

---

**API de autenticação completa e segura para o Dashboard Mpinda Evata** 🔐✅