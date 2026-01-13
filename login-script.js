// ============================================
// Login Script - Dashboard Mpinda Evata
// Funcionalidades de autenticação e validação
// ============================================

// Configurações
const CONFIG = {
    apiUrl: 'http://localhost:3002/api/auth',
    redirectUrl: 'index.html',
    sessionTimeout: 24 * 60 * 60 * 1000 // 24 horas
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
    checkExistingSession();
    updateCurrentYear();
    checkServerStatus(); // Verificar se o servidor está rodando
});

// Inicializar funcionalidades do login
function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    const forgotForm = document.getElementById('forgotForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPassword);
    }
    
    // Adicionar listeners para Enter nos campos
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                passwordInput.focus();
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin(e);
            }
        });
    }
}

// Verificar se já existe uma sessão ativa
async function checkExistingSession() {
    const session = getStoredSession();
    if (session && await isSessionValid(session)) {
        showNotification('Sessão ativa encontrada. Redirecionando...', 'success');
        setTimeout(() => {
            window.location.href = CONFIG.redirectUrl;
        }, 1500);
    }
}

// Atualizar ano atual
function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Verificar se o servidor de autenticação está rodando
async function checkServerStatus() {
    try {
        // Criar um timeout manual para compatibilidade
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${CONFIG.apiUrl}/status`, {
            method: 'GET',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            console.log('[STATUS] Servidor de autenticação está online:', data);
            return true;
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.warn('[STATUS] Timeout ao verificar servidor de autenticação');
        } else {
            console.warn('[STATUS] Servidor de autenticação não está acessível:', error.message);
        }
        
        // Adicionar aviso informativo (não bloqueia o login)
        const loginForm = document.getElementById('loginForm');
        if (loginForm && !document.getElementById('serverWarning')) {
            const warningDiv = document.createElement('div');
            warningDiv.id = 'serverWarning';
            warningDiv.style.cssText = `
                background: #f59e0b;
                color: white;
                padding: 10px 12px;
                border-radius: 5px;
                margin-bottom: 12px;
                text-align: center;
                font-size: 12px;
                line-height: 1.4;
            `;
            warningDiv.innerHTML = `
                <strong style="font-size: 12px;">ℹ️ Modo Offline</strong><br>
                <small style="opacity: 0.9; font-size: 11px;">Login funciona localmente. Para funcionalidades completas: <code style="background: rgba(0,0,0,0.2); padding: 1px 4px; border-radius: 3px; font-size: 10px;">start-all.bat</code></small>
            `;
            loginForm.insertBefore(warningDiv, loginForm.firstChild);
        }
        
        return false;
    }
    return false;
}

// Manipular login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validações básicas
    if (!email || !password) {
        showNotification('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Por favor, digite um email válido', 'error');
        return;
    }
    
    // Mostrar loading
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    loginBtn.disabled = true;
    
    try {
        // Simular delay de autenticação
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Verificar credenciais via API
        const result = await validateCredentials(email, password, remember);
        
        if (result.success) {
            showNotification('Login realizado com sucesso!', 'success');
            
            // Redirecionar após sucesso
            setTimeout(() => {
                window.location.href = CONFIG.redirectUrl;
            }, 1000);
            
        } else {
            showNotification(result.error, 'error');
        }
        
    } catch (error) {
        console.error('Erro no login:', error);
        showNotification('Erro interno. Tente novamente.', 'error');
    } finally {
        // Restaurar botão
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    }
}

// Credenciais locais (fallback quando servidor não está disponível)
const LOCAL_CREDENTIALS = {
    'admin@mpindaevata.com': {
        password: 'admin123',
        user: {
            id: 1,
            nome: 'Administrador',
            email: 'admin@mpindaevata.com',
            role: 'admin'
        }
    },
    'rh@mpindaevata.com': {
        password: 'rh123',
        user: {
            id: 2,
            nome: 'Gestor RH',
            email: 'rh@mpindaevata.com',
            role: 'rh'
        }
    },
    'financeiro@mpindaevata.com': {
        password: 'fin123',
        user: {
            id: 3,
            nome: 'Analista Financeiro',
            email: 'financeiro@mpindaevata.com',
            role: 'financeiro'
        }
    },
    'vendas@mpindaevata.com': {
        password: 'vendas123',
        user: {
            id: 4,
            nome: 'Gerente Vendas',
            email: 'vendas@mpindaevata.com',
            role: 'vendas'
        }
    }
};

// Validar credenciais localmente (fallback)
function validateCredentialsLocal(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const credential = LOCAL_CREDENTIALS[normalizedEmail];
    
    if (!credential) {
        return { success: false, error: 'Credenciais inválidas' };
    }
    
    if (credential.password !== password) {
        return { success: false, error: 'Credenciais inválidas' };
    }
    
    // Gerar tokens simples para compatibilidade
    const sessionToken = 'local_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    const accessToken = 'local_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    return {
        success: true,
        data: {
            user: credential.user,
            tokens: {
                accessToken: accessToken,
                sessionToken: sessionToken
            },
            expiresAt: expiresAt,
            loginTime: Date.now(),
            isLocal: true // Marcar como login local
        }
    };
}

// Validar credenciais via API com fallback local
async function validateCredentials(email, password, remember) {
    // Normalizar email (trim e lowercase)
    const normalizedEmail = email.trim().toLowerCase();
    
    console.log('[LOGIN] Tentando autenticar:', normalizedEmail);
    
    // Tentar primeiro via API
    try {
        console.log('[LOGIN] Tentando conectar à API:', `${CONFIG.apiUrl}/login`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 segundos de timeout (mais rápido)
        
        const response = await fetch(`${CONFIG.apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: normalizedEmail, 
                password: password, 
                remember: remember 
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('[LOGIN] Status da resposta:', response.status);
        console.log('[LOGIN] Status OK:', response.ok);
        
        const data = await response.json();
        console.log('[LOGIN] Dados recebidos:', data);
        
        if (response.ok && data.success) {
            // Armazenar dados da sessão
            const sessionData = {
                user: data.user,
                tokens: data.tokens,
                expiresAt: data.expiresAt,
                loginTime: Date.now(),
                remember: remember,
                isLocal: false
            };
            
            storeSession(sessionData);
            console.log('[LOGIN] Sessão armazenada com sucesso (via API)');
            return { success: true, data: sessionData };
        } else {
            const errorMsg = data.error || 'Erro na autenticação';
            console.error('[LOGIN] Erro de autenticação:', errorMsg);
            return { success: false, error: errorMsg };
        }
    } catch (error) {
        console.warn('[LOGIN] Erro ao conectar à API:', error.message);
        console.log('[LOGIN] Usando validação local como fallback...');
        
        // Se falhar, usar validação local
        const localResult = validateCredentialsLocal(normalizedEmail, password);
        
        if (localResult.success) {
            console.log('[LOGIN] Login bem-sucedido usando validação local');
            storeSession(localResult.data);
            
            // Não mostrar aviso adicional - o aviso na página já é suficiente
            // O login funcionou, então não precisamos alarmar o usuário
            
            return localResult;
        } else {
            return { 
                success: false, 
                error: 'Credenciais inválidas. Verifique email e senha.' 
            };
        }
    }
}

// Obter role do usuário baseado no email
function getUserRole(email) {
    if (email.includes('admin')) return 'admin';
    if (email.includes('rh')) return 'rh';
    if (email.includes('financeiro')) return 'financeiro';
    if (email.includes('vendas')) return 'vendas';
    return 'user';
}

// Armazenar sessão
function storeSession(sessionData) {
    const storage = sessionData.remember ? localStorage : sessionStorage;
    storage.setItem('mpindaEvataSession', JSON.stringify(sessionData));
}

// Recuperar sessão armazenada
function getStoredSession() {
    let session = localStorage.getItem('mpindaEvataSession');
    if (!session) {
        session = sessionStorage.getItem('mpindaEvataSession');
    }
    return session ? JSON.parse(session) : null;
}

// Verificar se a sessão é válida
async function isSessionValid(session) {
    if (!session || !session.tokens || !session.tokens.sessionToken) return false;
    
    try {
        const response = await fetch(`${CONFIG.apiUrl}/verify-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionToken: session.tokens.sessionToken })
        });
        
        const data = await response.json();
        return response.ok && data.valid;
    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        return false;
    }
}

// Validar formato de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Alternar visibilidade da senha
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

// Mostrar modal de esqueci a senha
function showForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.classList.add('active');
    
    // Focar no campo de email
    setTimeout(() => {
        document.getElementById('forgotEmail').focus();
    }, 300);
}

// Fechar modal de esqueci a senha
function closeForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.classList.remove('active');
}

// Manipular recuperação de senha
async function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgotEmail').value.trim();
    
    if (!email) {
        showNotification('Por favor, digite seu email', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Por favor, digite um email válido', 'error');
        return;
    }
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${CONFIG.apiUrl}/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Instruções enviadas para seu email!', 'success');
            closeForgotPassword();
            document.getElementById('forgotEmail').value = '';
        } else {
            showNotification(data.error || 'Erro ao enviar email', 'error');
        }
        
    } catch (error) {
        console.error('Erro na recuperação de senha:', error);
        showNotification('Erro de conexão. Tente novamente.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Mostrar tela de registro (placeholder)
function showRegister() {
    showNotification('Entre em contato com o administrador para solicitar acesso', 'warning');
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = getNotificationIcon(type);
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Obter ícone da notificação
function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fas fa-check-circle';
        case 'error': return 'fas fa-exclamation-circle';
        case 'warning': return 'fas fa-exclamation-triangle';
        default: return 'fas fa-info-circle';
    }
}

// Fechar modal ao clicar fora
document.addEventListener('click', function(event) {
    const modal = document.getElementById('forgotPasswordModal');
    if (event.target === modal) {
        closeForgotPassword();
    }
});

// Adicionar animação de saída para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Função para logout (para uso no dashboard)
function logout() {
    localStorage.removeItem('mpindaEvataSession');
    sessionStorage.removeItem('mpindaEvataSession');
    window.location.href = 'login.html';
}

// Exportar funções para uso global
window.togglePassword = togglePassword;
window.showForgotPassword = showForgotPassword;
window.closeForgotPassword = closeForgotPassword;
window.showRegister = showRegister;
window.logout = logout;