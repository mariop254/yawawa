# Dashboard Mpinda Evata - Guia de Desenvolvimento

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 12+ instalado
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Executar em Desenvolvimento

```bash
# Opção 1: Usando npm
npm run dev

# Opção 2: Diretamente com Node.js
node dev-server.js

# Opção 3: Porta personalizada
PORT=8080 node dev-server.js
```

O servidor será iniciado em `http://localhost:3000` (ou porta especificada).

## 📁 Estrutura do Projeto (Nova Arquitetura Modular)

```
/
├── index.html              # Arquivo principal (versão atual)
├── styles.css              # CSS monolítico (versão atual)
├── script.js               # JavaScript monolítico (versão atual)
├── data-example.json       # Dados de exemplo (versão atual)
├── dev-server.js           # Servidor de desenvolvimento
├── package.json            # Configuração do projeto
│
└── src/                    # 🆕 Nova estrutura modular
    ├── core/
    │   ├── index.html      # HTML refatorado
    │   └── main.js         # Coordenador principal
    ├── styles/
    │   ├── core/
    │   │   ├── base.css    # Reset, variáveis, tipografia
    │   │   ├── layout.css  # Grid, flexbox, estruturas
    │   │   └── components.css # Cards, botões, modais
    │   ├── modules/
    │   │   ├── rh.css      # Estilos específicos RH
    │   │   ├── financeiro.css # Estilos financeiros
    │   │   ├── vendas.css  # Estilos de vendas
    │   │   └── navigation.css # Navegação e header
    │   └── main.css        # Importa todos os estilos
    ├── scripts/
    │   ├── modules/
    │   │   ├── rh.js       # Funcionalidades RH
    │   │   ├── financeiro.js # Funcionalidades financeiras
    │   │   ├── vendas.js   # Funcionalidades vendas
    │   │   └── navigation.js # Sistema de navegação
    │   ├── components/
    │   │   ├── charts.js   # Configurações Chart.js
    │   │   ├── modals.js   # Sistema de modais
    │   │   └── notifications.js # Notificações
    │   └── utils/
    │       ├── dom.js      # Utilitários DOM
    │       ├── data.js     # Manipulação de dados
    │       └── helpers.js  # Funções auxiliares
    ├── assets/
    │   └── data/
    │       └── sample-data.json # Dados movidos
    └── build/
        ├── build.js        # Script de build
        └── dist/           # Arquivos gerados
            ├── styles.css  # CSS concatenado
            ├── script.js   # JS concatenado
            └── index.html  # HTML final
```

## 🔧 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm start            # Alias para npm run dev

# Build (quando implementado)
npm run build        # Gera arquivos para produção

# Servidor simples
npm run serve        # Serve arquivos estáticos
```

## 🎯 Status da Migração

### ✅ Concluído
- [x] Servidor de desenvolvimento configurado
- [x] Estrutura de diretórios criada
- [x] Documentação de desenvolvimento

### 🚧 Em Progresso
- [ ] Sistema de build (CSS/JS concatenation)
- [ ] Refatoração CSS modular
- [ ] Refatoração JavaScript modular
- [ ] Migração HTML

### 📋 Próximos Passos
- [ ] Testes de compatibilidade
- [ ] Otimização de performance
- [ ] Documentação final

## 🌐 Acessando o Dashboard

1. Execute `npm run dev`
2. Abra `http://localhost:3000` no navegador
3. O dashboard atual (versão monolítica) será exibido
4. Durante a migração, a nova versão estará em `http://localhost:3000/src/core/`

## 🔍 Desenvolvimento

### Estrutura Atual (Monolítica)
- **index.html**: Interface completa
- **styles.css**: Todos os estilos em um arquivo
- **script.js**: Toda funcionalidade em um arquivo

### Nova Estrutura (Modular)
- **Separação por responsabilidade**: Cada módulo tem seus próprios arquivos
- **Build system**: Concatena arquivos para produção
- **Melhor manutenibilidade**: Código organizado e testável

### Convenções de Código
- **Português**: Toda interface e comentários em português brasileiro
- **CSS**: Classes em kebab-case (`.card-header`)
- **JavaScript**: Funções em camelCase (`openModal()`)
- **HTML**: IDs em kebab-case (`dashboard-main`)

## 🐛 Troubleshooting

### Porta em uso
```bash
# Use uma porta diferente
PORT=8080 npm run dev
```

### Arquivos não carregam
- Verifique se o servidor está rodando
- Confirme que os arquivos existem no diretório correto
- Verifique o console do navegador para erros

### Performance lenta
- O servidor de desenvolvimento não usa cache
- Para produção, use os arquivos concatenados do build

## 📞 Suporte

Para dúvidas sobre desenvolvimento:
1. Verifique este README
2. Consulte a documentação no README.md principal
3. Verifique os comentários no código fonte