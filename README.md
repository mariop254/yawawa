# Dashboard Centralizado - RH, Financeiro e Vendas

Um dashboard moderno e responsivo para centralizar indicadores e funcionalidades de Recursos Humanos, Financeiro e Vendas em uma interface intuitiva.

## 🎯 Características Principais

### Layout e Estrutura
- **Barra Superior**: Menu organizado por módulos (RH, Financeiro, Vendas, Compras, Serviços, Contabilidade, Configurações)
- **Painel Principal**: Dividido em três colunas com cards modernos e indicadores visuais
- **Rodapé**: Timeline mostrando evolução anual dos principais indicadores
- **Design Responsivo**: Adaptável a diferentes tamanhos de tela

### Módulos Implementados

#### 📊 Recursos Humanos (RH)
- **Disponibilidade de Funcionários**: Gauge circular mostrando % de presença
- **Performance por Equipe**: Gráfico de barras com performance das equipes
- **Turnover Mensal**: Indicador com tendência e detalhamento
- **Ranking de Produtividade**: Lista dos funcionários mais produtivos

#### 💰 Financeiro
- **Visão Geral Financeira**: Cards com Receitas, Despesas e Lucro Líquido
- **Fluxo de Caixa**: Gráfico de linha com entradas e saídas
- **Maiores Despesas**: Ranking das principais categorias de gastos
- **Comparativo de Faturamento**: Gráfico comparativo mensal

#### 🛒 Vendas
- **Total de Vendas**: Valor total com comparação mensal
- **Ticket Médio**: Valor médio por transação
- **Produtos Mais Vendidos**: Gráfico horizontal dos top produtos
- **Ranking de Vendedores**: Performance dos vendedores

## 🎨 Estilo Visual

### Cores e Tema
- **Fundo Escuro**: Gradiente escuro moderno (#0f1419 → #2d3748)
- **Cores de Destaque**: 
  - Azul (#3b82f6) - Principal
  - Verde (#10b981) - Positivo/Sucesso
  - Laranja (#f59e0b) - Aviso/Destaque
- **Tipografia**: Segoe UI moderna e legível

### Elementos Visuais
- **Cards**: Bordas arredondadas com sombras e efeitos hover
- **Gráficos**: Chart.js com temas personalizados e animações
- **Ícones**: Font Awesome minimalistas para cada módulo
- **Animações**: Transições suaves e efeitos de entrada

## 🚀 Funcionalidades

### Interatividade
- **Navegação por Módulos**: Clique nos menus para navegar
- **Busca**: Campo de busca para encontrar indicadores específicos
- **Hover Effects**: Cards respondem ao mouse com animações
- **Responsividade**: Layout se adapta a diferentes dispositivos

### Gráficos e Visualizações
- **Gauge Circular**: Para disponibilidade de funcionários
- **Gráficos de Barras**: Performance e produtos
- **Gráficos de Linha**: Fluxo de caixa e evolução temporal
- **Gráficos Horizontais**: Ranking de produtos

### Atualizações em Tempo Real
- **Simulação de Dados**: Atualizações automáticas a cada 30 segundos
- **Animações**: Números animam ao carregar a página
- **Timeline Dinâmica**: Indicadores ativos rotacionam automaticamente

## 📱 Responsividade

### Breakpoints
- **Desktop**: > 1200px - Layout em 3 colunas
- **Tablet**: 768px - 1200px - Layout adaptativo
- **Mobile**: < 768px - Layout em coluna única

### Adaptações Mobile
- Menu superior empilhado
- Cards em coluna única
- Timeline vertical
- Gráficos redimensionados

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com Grid e Flexbox
- **JavaScript ES6+**: Funcionalidades interativas
- **Chart.js**: Biblioteca de gráficos

### Backend/Autenticação
- **Node.js**: Servidor de autenticação simples
- **HTTP Server**: Servidor de desenvolvimento nativo
- **Sessões em memória**: Gerenciamento de sessões

### Dependências Externas
- **Font Awesome**: Ícones
- **Chart.js CDN**: Gráficos interativos

## 📁 Estrutura do Projeto

```
RH_FA_VDA/
├── index.html              # Arquivo principal HTML
├── login.html              # Tela de login
├── login-script.js         # Script de autenticação
├── login-styles.css        # Estilos da tela de login
├── auth-guard.js           # Proteção de rotas
├── simple-auth-server.js   # Servidor de autenticação (porta 3002)
├── dev-server.js           # Servidor de desenvolvimento (porta 3000)
├── start-all.ps1           # Script para iniciar ambos servidores (PowerShell)
├── start-all.bat           # Script para iniciar ambos servidores (CMD)
├── styles.css              # Estilos CSS
├── script.js               # Funcionalidades JavaScript
└── README.md               # Documentação
```

## 🚀 Como Usar

### 1. Iniciar os Servidores

O sistema requer **dois servidores** rodando simultaneamente:

#### Opção A: Script Automático (Recomendado)
```bash
# Windows (PowerShell)
.\start-all.ps1

# Windows (CMD)
start-all.bat

# Ou usando npm
npm run start:all
```

#### Opção B: Manual
```bash
# Terminal 1 - Servidor de Autenticação (porta 3002)
node simple-auth-server.js

# Terminal 2 - Servidor de Desenvolvimento (porta 3000)
node dev-server.js
```

### 2. Acessar o Sistema
- Acesse: `http://localhost:3000/login.html`
- O sistema redirecionará automaticamente para o login se não estiver autenticado

### 3. Credenciais de Teste
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

### 4. Abrir o Dashboard
- Após fazer login, você será redirecionado para o dashboard principal
- Recomendado: Chrome, Firefox, Safari ou Edge

### 2. Navegação
- Use os menus superiores para navegar entre módulos
- Clique nos cards para ver detalhes (funcionalidade futura)
- Use a barra de busca para encontrar indicadores específicos

### 3. Atalhos de Teclado
- **Ctrl/Cmd + K**: Focar na busca
- **ESC**: Limpar busca

### 4. Visualização de Dados
- Hover sobre gráficos para tooltips detalhados
- Clique nas legendas para mostrar/ocultar séries
- Timeline automática no rodapé

## 🔧 Personalização

### Cores
Para alterar as cores, edite as variáveis CSS no arquivo `styles.css`:

```css
:root {
    --primary-color: #3b82f6;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --background-dark: #0f1419;
}
```

### Dados
Para conectar com dados reais, modifique as funções no arquivo `script.js`:

```javascript
// Exemplo: Conectar com API
async function fetchRealData() {
    const response = await fetch('/api/dashboard-data');
    const data = await response.json();
    updateDashboard(data);
}
```

### Gráficos
Personalize os gráficos editando as opções do Chart.js em `script.js`:

```javascript
options: {
    plugins: {
        legend: {
            position: 'top',
            labels: {
                color: '#f1f5f9'
            }
        }
    }
}
```

## 📊 Indicadores Disponíveis

### RH
- Taxa de presença (%)
- Performance por equipe (%)
- Turnover mensal (%)
- Ranking de produtividade (top 3)

### Financeiro
- Receitas (R$)
- Despesas (R$)
- Lucro líquido (R$)
- Fluxo de caixa mensal
- Top despesas por categoria

### Vendas
- Total de vendas mensal (R$)
- Ticket médio (R$)
- Top produtos por valor
- Ranking de vendedores

## 🔮 Funcionalidades Futuras

### Planejadas
- [ ] Filtros por período
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Notificações em tempo real
- [ ] Dashboard personalizável por usuário
- [ ] Integração com APIs externas
- [ ] Modo offline

### Melhorias Técnicas
- [ ] PWA (Progressive Web App)
- [ ] Cache de dados
- [ ] Lazy loading de gráficos
- [ ] Testes automatizados
- [ ] Build otimizado

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste em diferentes dispositivos
5. Envie um pull request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- Abra uma issue no repositório
- Consulte a documentação
- Verifique os exemplos de código

---

**Desenvolvido com ❤️ para centralizar e simplificar a visualização de indicadores empresariais**










