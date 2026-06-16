# Sistema de Faturamento - Clean Architecture

Um sistema de faturamento modular construído com Python, JavaScript, CSS e SQLite, seguindo os princípios da Clean Architecture.

## 📁 Estrutura do Projeto

```
billing_system/
├── 1_core/
│   ├── domain/              # Entidades e regras de negócio puras
│   └── application/         # Casos de uso e fluxos de aplicação
├── 2_infrastructure/        # Acesso a dados e configurações técnicas
├── 3_presentation/          # Interface web com Blazor-like (HTML/CSS/JS)
└── tests/                   # Testes unitários
```

## 🏗️ Princípios da Clean Architecture

- **Domain**: Código Python puro, sem dependências externas
- **Application**: Define os contratos (interfaces) e casos de uso
- **Infrastructure**: Implementação com SQLite e acesso a dados
- **Presentation**: Interface web com HTML, CSS e JavaScript

## 🚀 Como Usar

### Instalação

```bash
pip install -r requirements.txt
```

### Executar o Sistema

```bash
python app.py
```

Acesse: `http://localhost:5000`
