# Sistema de Login - Dashboard Mpinda Evata

## 🔐 Visão Geral

Sistema de autenticação completo para o Dashboard Mpinda Evata, mantendo a identidade visual original do sistema.

## 📁 Arquivos Criados

- **`login.html`** - Tela de login principal
- **`login-styles.css`** - Estilos da tela de login
- **`login-script.js`** - Funcionalidades de autenticação
- **`auth-guard.js`** - Proteção do dashboard principal

## 🎨 Design e Identidade Visual

### Mantém a Originalidade
- **Cores**: Mesma paleta (#1a1a2e, #16213e, #4ecdc4)
- **Tipografia**: Segoe UI (mesma fonte do sistema)
- **Elementos**: Cards com bordas arredondadas e sombras
- **Animações**: Transições suaves e efeitos hover

### Elementos Visuais
- **Background animado** com formas flutuantes
- **Card de login** com backdrop blur
- **Logo** com fallback SVG automático
- **Botões** com gradiente característico
- **Notificações** no estilo do sistema

## 🚀 Como Usar

### 1. Acessar o Sistema
```
http://localhost:3000/login.html
```

### 2. Credenciais de Demonstração
```
Email: admin@mpindaevata.com
Senha: admin123

Email: rh@mpindaevata.com  
Senha: rh123

Email: financeiro@mpindaevata.com
Senha: fin123

Email: vendas@mpindaevata.com
Senha: vendas123
```

### 3. Funcionalidades

#### Login
- **Validação de email** em tempo real
- **Toggle de senha** (mostrar/ocultar)
- **Lembrar-me** (sessão persistente)
- **Loading state** durante autenticação

#### Recuperação de Senha
- **Modal integrado** para recuperação
- **Validação de email**
- **Simulação de envio** de instruções

#### Proteção do Dashboard
- **Verificação automática** de sessão
- **Redirecionamento** se não autenticado
- **Renovação automática** da sessão
- **Botão de logout** integrado

## 🔧 Configurações

### Timeout de Sessão
```javascript
// Em login-script.js
sessionTimeout: 24 * 60 * 60 * 1000 // 24 horas
```

### Credenciais (Desenvolvimento)
```javascript
// Em login-script.js - CONFIG.demoCredentials
demoCredentials: {
    'admin@mpindaevata.com': 'admin123',
    'rh@mpindaevata.com': 'rh123',
    // ... adicionar mais conforme necessário
}
```

### URL de Redirecionamento
```javascript
// Em login-script.js
redirectUrl: 'index.html'
```

## 🛡️ Segurança

### Funcionalidades Implementadas
- **Validação client-side** de formulários
- **Sessões com timeout** configurável
- **Limpeza automática** de sessões inválidas
- **Verificação periódica** de autenticação

### Para Produção
- Substituir `demoCredentials` por chamadas de API
- Implementar hash de senhas
- Adicionar CSRF protection
- Configurar HTTPS obrigatório

## 📱 Responsividade

### Breakpoints
- **Desktop**: Layout completo
- **Tablet**: Ajustes de espaçamento
- **Mobile**: Layout otimizado para telas pequenas

### Adaptações Mobile
- **Formulário** em coluna única
- **Botões** com tamanho touch-friendly
- **Modal** responsivo
- **Notificações** adaptadas

## 🔄 Fluxo de Autenticação

### 1. Acesso Inicial
```
Usuário acessa qualquer página → 
Verificação de sessão → 
Se não autenticado → Redireciona para login
```

### 2. Login Bem-sucedido
```
Credenciais válidas → 
Criar sessão → 
Armazenar dados → 
Redirecionar para dashboard
```

### 3. Navegação Protegida
```
Cada página carrega → 
auth-guard.js verifica sessão → 
Se válida → Permite acesso → 
Se inválida → Redireciona para login
```

## 🎯 Funcionalidades Avançadas

### Notificações
- **Sistema integrado** de notificações
- **Tipos**: success, error, warning, info
- **Auto-dismiss** após 5 segundos
- **Animações** de entrada e saída

### Sessão Inteligente
- **Renovação automática** a cada 30 minutos
- **Verificação periódica** a cada 5 minutos
- **Suporte a múltiplas abas**
- **Limpeza automática** ao expirar

### Interface de Usuário
- **Nome do usuário** extraído do email
- **Role indicator** baseado no email
- **Botão de logout** integrado
- **Confirmação** antes do logout

## 🚀 Integração com Dashboard Existente

### Modificações Mínimas
- **Adicionado** `auth-guard.js` ao index.html
- **Mantida** toda funcionalidade original
- **Preservado** design e comportamento
- **Adicionado** botão de logout discreto

### Compatibilidade
- **100% compatível** com código existente
- **Não interfere** em funcionalidades atuais
- **Adiciona apenas** camada de segurança
- **Mantém** performance original

## 📞 Suporte e Manutenção

### Logs de Debug
O sistema registra logs no console do navegador:
- Tentativas de login
- Verificações de sessão
- Erros de autenticação
- Renovações de sessão

### Troubleshooting
- **Sessão não persiste**: Verificar localStorage/sessionStorage
- **Redirecionamento infinito**: Verificar credenciais em demoCredentials
- **Estilos não carregam**: Verificar caminho dos arquivos CSS
- **JavaScript não funciona**: Verificar console para erros

---

**Sistema de login criado mantendo 100% da originalidade do design Mpinda Evata** ✅