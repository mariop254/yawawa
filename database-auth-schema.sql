-- ============================================
-- Schema de Autenticação - Dashboard Mpinda Evata
-- Tabelas para sistema de login e usuários
-- ============================================

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(200) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- admin, rh, financeiro, vendas, user
    ativo BOOLEAN DEFAULT 1,
    primeiro_login BOOLEAN DEFAULT 1,
    ultimo_login DATETIME NULL,
    tentativas_login INTEGER DEFAULT 0,
    bloqueado_ate DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Sessões
CREATE TABLE IF NOT EXISTS sessoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at DATETIME NOT NULL,
    ativo BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Logs de Autenticação
CREATE TABLE IF NOT EXISTS logs_autenticacao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    email VARCHAR(150),
    acao VARCHAR(50) NOT NULL, -- login_sucesso, login_falha, logout, sessao_expirada
    ip_address VARCHAR(45),
    user_agent TEXT,
    detalhes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabela de Tokens de Recuperação
CREATE TABLE IF NOT EXISTS tokens_recuperacao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    usado BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON usuarios(ativo);
CREATE INDEX IF NOT EXISTS idx_sessoes_token ON sessoes(token);
CREATE INDEX IF NOT EXISTS idx_sessoes_usuario ON sessoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_expires ON sessoes(expires_at);
CREATE INDEX IF NOT EXISTS idx_logs_usuario ON logs_autenticacao(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_acao ON logs_autenticacao(acao);
CREATE INDEX IF NOT EXISTS idx_tokens_token ON tokens_recuperacao(token);

-- Inserir usuários padrão (senhas serão hasheadas pela API)
-- Senha padrão para todos: 'admin123'
INSERT OR IGNORE INTO usuarios (nome, email, senha_hash, salt, role) VALUES 
('Administrador', 'admin@mpindaevata.com', '', '', 'admin'),
('Gestor RH', 'rh@mpindaevata.com', '', '', 'rh'),
('Analista Financeiro', 'financeiro@mpindaevata.com', '', '', 'financeiro'),
('Gerente Vendas', 'vendas@mpindaevata.com', '', '', 'vendas'),
('João Silva', 'joao@mpindaevata.com', '', '', 'user'),
('Maria Santos', 'maria@mpindaevata.com', '', '', 'user');