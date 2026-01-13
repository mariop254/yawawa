// ============================================
// Auth Guard - Dashboard Mpinda Evata
// Proteção de rotas e verificação de sessão
// ============================================

// Verificar autenticação ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setupLogoutButton();
});

// Verificar se o usuário está autenticado
async function checkAuthentication() {
    const session = getStoredSession();
    
    if (!session || !(await isSessionValid(session))) {
        // Redirecionar para login se não estiver autenticado
        redirectToLogin();
        return;
    }
    
    // Atualizar informações do usuário na interface
    updateUserInterface(session);
    
    // Configurar renovação automática da sessão
    setupSessionRenewal(session);
}

// Recuperar sessão armazenada
function getStoredSession() {
    let session = localStorage.getItem('mpindaEvataSession');
    if (!session) {
        session = sessionStorage.getItem('mpindaEvataSession');
    }
    return session ? JSON.parse(session) : null;
}

// Verificar se a sessão é válida via API
async function isSessionValid(session) {
    if (!session || !session.tokens || !session.tokens.sessionToken) return false;
    
    // Se for sessão local (modo offline), validar localmente
    if (session.isLocal) {
        // Verificar se não expirou (24 horas)
        if (session.expiresAt) {
            const expiresAt = new Date(session.expiresAt);
            if (expiresAt < new Date()) {
                console.log('[AUTH] Sessão local expirada');
                return false;
            }
        }
        console.log('[AUTH] Sessão local válida');
        return true;
    }
    
    // Tentar verificar via API
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch('http://localhost:3002/api/auth/verify-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionToken: session.tokens.sessionToken }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        const data = await response.json();
        return response.ok && data.valid;
    } catch (error) {
        console.warn('[AUTH] Erro ao verificar sessão via API, usando validação local:', error.message);
        
        // Se falhar e for sessão local, aceitar
        if (session.isLocal) {
            return true;
        }
        
        // Se não for local e falhar, verificar expiração localmente
        if (session.expiresAt) {
            const expiresAt = new Date(session.expiresAt);
            return expiresAt > new Date();
        }
        
        return false;
    }
}

// Redirecionar para login
function redirectToLogin() {
    // Limpar sessões inválidas
    localStorage.removeItem('mpindaEvataSession');
    sessionStorage.removeItem('mpindaEvataSession');
    
    // Mostrar mensagem se não estiver na página de login
    if (!window.location.pathname.includes('login.html')) {
        alert('Sua sessão expirou. Você será redirecionado para o login.');
        window.location.href = 'login.html';
    }
}

// Atualizar interface com informações do usuário
function updateUserInterface(session) {
    // Atualizar nome do usuário na interface
    const userInfoElements = document.querySelectorAll('.user-info span');
    if (userInfoElements.length > 0 && session.user) {
        const userName = session.user.nome || session.user.email.split('@')[0];
        userInfoElements[userInfoElements.length - 1].textContent = userName;
    }
    
    // Adicionar indicador de role se necessário
    if (session.user && session.user.role && session.user.role !== 'user') {
        const roleIndicator = document.createElement('span');
        roleIndicator.className = 'user-role';
        roleIndicator.textContent = `(${session.user.role.toUpperCase()})`;
        roleIndicator.style.cssText = `
            font-size: 0.7rem;
            color: #4ecdc4;
            margin-left: 0.3rem;
        `;
        
        const userInfo = document.querySelector('.user-info');
        if (userInfo && !userInfo.querySelector('.user-role')) {
            userInfo.appendChild(roleIndicator);
        }
    }
}

// Configurar botão de logout
function setupLogoutButton() {
    // Adicionar botão de logout se não existir
    const userInfo = document.querySelector('.user-info');
    if (userInfo && !document.querySelector('.logout-btn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'logout-btn';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        logoutBtn.title = 'Sair do sistema';
        logoutBtn.style.cssText = `
            background: rgba(255, 107, 107, 0.2);
            border: 1px solid rgba(255, 107, 107, 0.3);
            border-radius: 6px;
            padding: 0.4rem 0.6rem;
            color: #ff6b6b;
            cursor: pointer;
            margin-left: 1rem;
            transition: all 0.3s ease;
        `;
        
        logoutBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 107, 107, 0.3)';
            this.style.transform = 'scale(1.05)';
        });
        
        logoutBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 107, 107, 0.2)';
            this.style.transform = 'scale(1)';
        });
        
        logoutBtn.addEventListener('click', confirmLogout);
        
        userInfo.appendChild(logoutBtn);
    }
}

// Confirmar logout
function confirmLogout() {
    const confirmed = confirm('Tem certeza que deseja sair do sistema?');
    if (confirmed) {
        performLogout();
    }
}

// Executar logout
async function performLogout() {
    const session = getStoredSession();
    
    // Notificar API sobre logout
    if (session && session.tokens) {
        try {
            await fetch('http://localhost:3002/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.tokens.accessToken}`
                },
                body: JSON.stringify({ sessionToken: session.tokens.sessionToken })
            });
        } catch (error) {
            console.error('Erro ao notificar logout:', error);
        }
    }
    
    // Limpar sessões locais
    localStorage.removeItem('mpindaEvataSession');
    sessionStorage.removeItem('mpindaEvataSession');
    
    // Mostrar mensagem de sucesso
    showLogoutMessage();
    
    // Redirecionar para login após delay
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// Mostrar mensagem de logout
function showLogoutMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #16213e;
        border: 1px solid #4ecdc4;
        border-radius: 8px;
        padding: 2rem;
        color: white;
        text-align: center;
        z-index: 10000;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    `;
    
    message.innerHTML = `
        <i class="fas fa-check-circle" style="color: #10b981; font-size: 2rem; margin-bottom: 1rem;"></i>
        <h3 style="margin-bottom: 0.5rem;">Logout realizado com sucesso!</h3>
        <p style="color: #a8a8a8;">Redirecionando para o login...</p>
    `;
    
    document.body.appendChild(message);
    
    // Remover mensagem após redirecionamento
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 2000);
}

// Configurar renovação automática da sessão
function setupSessionRenewal(session) {
    // Renovar sessão a cada 30 minutos se o usuário estiver ativo
    setInterval(() => {
        const currentSession = getStoredSession();
        if (currentSession && isSessionValid(currentSession)) {
            // Atualizar timestamp da sessão
            currentSession.loginTime = Date.now();
            const storage = currentSession.remember ? localStorage : sessionStorage;
            storage.setItem('mpindaEvataSession', JSON.stringify(currentSession));
        }
    }, 30 * 60 * 1000); // 30 minutos
}

// Verificar sessão periodicamente
setInterval(async () => {
    const session = getStoredSession();
    if (!session || !(await isSessionValid(session))) {
        redirectToLogin();
    }
}, 5 * 60 * 1000); // Verificar a cada 5 minutos

// Exportar funções para uso global
window.checkAuthentication = checkAuthentication;
window.performLogout = performLogout;