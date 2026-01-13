// ============================================
// Servidor de Autenticação Simples - Dashboard Mpinda Evata
// Versão simplificada sem dependências externas
// ============================================

const http = require('http');
const url = require('url');
const querystring = require('querystring');

const PORT = 3002;

// Usuários de demonstração (em memória)
// IMPORTANTE: As chaves devem estar em lowercase para comparação
const users = {
    'admin@mpindaevata.com': {
        id: 1,
        nome: 'Administrador',
        email: 'admin@mpindaevata.com',
        password: 'admin123',
        role: 'admin'
    },
    'rh@mpindaevata.com': {
        id: 2,
        nome: 'Gestor RH',
        email: 'rh@mpindaevata.com',
        password: 'rh123',
        role: 'rh'
    },
    'financeiro@mpindaevata.com': {
        id: 3,
        nome: 'Analista Financeiro',
        email: 'financeiro@mpindaevata.com',
        password: 'fin123',
        role: 'financeiro'
    },
    'vendas@mpindaevata.com': {
        id: 4,
        nome: 'Gerente Vendas',
        email: 'vendas@mpindaevata.com',
        password: 'vendas123',
        role: 'vendas'
    }
};

// Função auxiliar para listar usuários (para debug)
function listUsers() {
    console.log('\n[DEBUG] Usuários cadastrados:');
    Object.keys(users).forEach(email => {
        console.log(`  - ${email} / ${users[email].password} (${users[email].role})`);
    });
    console.log('');
}

// Sessões ativas (em memória)
const sessions = new Map();

// Função para gerar token simples
function generateToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Função para adicionar headers CORS
function addCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
}

// Função para ler body da requisição
function readRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(error);
            }
        });
        req.on('error', reject);
    });
}

// Servidor HTTP
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    // Adicionar CORS headers
    addCorsHeaders(res);

    // Tratar OPTIONS (preflight)
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    console.log(`${new Date().toISOString()} - ${method} ${path}`);

    try {
        // Rota de login
        if (path === '/api/auth/login' && method === 'POST') {
            const body = await readRequestBody(req);
            const { email, password, remember } = body;

            console.log(`[LOGIN] Tentativa de login - Email: ${email}, Senha recebida: ${password ? '***' : '(vazia)'}`);

            if (!email || !password) {
                console.log('[LOGIN] Erro: Email ou senha vazios');
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Email e senha são obrigatórios' }));
                return;
            }

            // Normalizar email (lowercase e trim)
            const normalizedEmail = email.trim().toLowerCase();
            const user = users[normalizedEmail];
            
            console.log(`[LOGIN] Email normalizado: ${normalizedEmail}`);
            console.log(`[LOGIN] Usuário encontrado: ${user ? 'Sim' : 'Não'}`);
            if (user) {
                console.log(`[LOGIN] Senha esperada: ${user.password}, Senha recebida: ${password}`);
                console.log(`[LOGIN] Senhas correspondem: ${user.password === password}`);
            }

            if (!user || user.password !== password) {
                console.log('[LOGIN] Erro: Credenciais inválidas');
                res.writeHead(401);
                res.end(JSON.stringify({ error: 'Credenciais inválidas' }));
                return;
            }

            console.log(`[LOGIN] Sucesso! Usuário: ${user.nome} (${user.email})`);

            // Criar sessão
            const sessionToken = generateToken();
            const accessToken = generateToken();
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

            sessions.set(sessionToken, {
                userId: user.id,
                email: user.email,
                role: user.role,
                expiresAt: expiresAt
            });

            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                message: 'Login realizado com sucesso',
                user: {
                    id: user.id,
                    nome: user.nome,
                    email: user.email,
                    role: user.role
                },
                tokens: {
                    accessToken: accessToken,
                    sessionToken: sessionToken
                },
                expiresAt: expiresAt
            }));
            return;
        }

        // Rota de verificação de sessão
        if (path === '/api/auth/verify-session' && method === 'POST') {
            const body = await readRequestBody(req);
            const { sessionToken } = body;

            if (!sessionToken) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Token de sessão requerido' }));
                return;
            }

            const session = sessions.get(sessionToken);
            if (!session || new Date(session.expiresAt) < new Date()) {
                res.writeHead(401);
                res.end(JSON.stringify({ error: 'Sessão inválida ou expirada' }));
                return;
            }

            const user = Object.values(users).find(u => u.email === session.email);
            res.writeHead(200);
            res.end(JSON.stringify({
                valid: true,
                user: {
                    id: user.id,
                    nome: user.nome,
                    email: user.email,
                    role: user.role
                }
            }));
            return;
        }

        // Rota de logout
        if (path === '/api/auth/logout' && method === 'POST') {
            const body = await readRequestBody(req);
            const { sessionToken } = body;

            if (sessionToken && sessions.has(sessionToken)) {
                sessions.delete(sessionToken);
            }

            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                message: 'Logout realizado com sucesso'
            }));
            return;
        }

        // Rota de recuperação de senha
        if (path === '/api/auth/forgot-password' && method === 'POST') {
            const body = await readRequestBody(req);
            const { email } = body;

            // Simular envio de email
            console.log(`Token de recuperação solicitado para: ${email}`);

            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                message: 'Se o email existir, as instruções foram enviadas'
            }));
            return;
        }

        // Rota de status
        if (path === '/api/auth/status' && method === 'GET') {
            res.writeHead(200);
            res.end(JSON.stringify({
                status: 'online',
                service: 'Mpinda Evata Simple Auth API',
                version: '1.0.0',
                timestamp: new Date().toISOString(),
                activeSessions: sessions.size
            }));
            return;
        }

        // Rota não encontrada
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Endpoint não encontrado' }));

    } catch (error) {
        console.error('Erro no servidor:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Erro interno do servidor' }));
    }
});

// Limpeza de sessões expiradas a cada 5 minutos
setInterval(() => {
    const now = new Date();
    for (const [token, session] of sessions.entries()) {
        if (new Date(session.expiresAt) < now) {
            sessions.delete(token);
        }
    }
}, 5 * 60 * 1000);

// Iniciar servidor
server.listen(PORT, () => {
    console.log('🔐 Dashboard Mpinda Evata - API de Autenticação Simples');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📍 Servidor rodando em: http://localhost:${PORT}`);
    console.log(`🔑 Endpoints disponíveis:`);
    console.log(`   • POST /api/auth/login`);
    console.log(`   • POST /api/auth/logout`);
    console.log(`   • POST /api/auth/verify-session`);
    console.log(`   • POST /api/auth/forgot-password`);
    console.log(`   • GET  /api/auth/status`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔒 Credenciais de teste:');
    console.log('   • admin@mpindaevata.com / admin123');
    console.log('   • rh@mpindaevata.com / rh123');
    console.log('   • financeiro@mpindaevata.com / fin123');
    console.log('   • vendas@mpindaevata.com / vendas123');
    console.log('');
    console.log('💡 Para testar: http://localhost:3000/login.html');
    console.log('');
    listUsers();
});

// Tratamento de erros
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Erro: Porta ${PORT} já está em uso.`);
        console.error('   Tente parar outros processos ou usar uma porta diferente.');
    } else {
        console.error('❌ Erro no servidor:', err.message);
    }
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor encerrado com sucesso.');
        process.exit(0);
    });
});