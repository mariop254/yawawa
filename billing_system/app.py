"""Aplicação Principal - Flask com Clean Architecture"""

from flask import Flask, render_template, jsonify, request
from datetime import datetime
import sys
import os

# Adicionar diretório ao path para importações relativas
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Importações da camada de infraestrutura
from infrastructure.database import init_db, get_database_url, db
from infrastructure.models import ProdutoModel, ClienteModel, FaturaModel, ItemFaturaModel
from infrastructure.repositories import (
    ProdutoRepository,
    ClienteRepository,
    FaturaRepository,
)

# Importações da camada de aplicação
from core.application.use_cases import (
    CriarFaturaUseCase,
    FinalizarFaturaUseCase,
    ListarFaturasUseCase,
)

# Importações da camada de domínio
from core.domain.entities import Produto, Cliente

# Inicializar Flask
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = get_database_url()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar banco de dados
init_db(app)

# Inicializar repositórios
produto_repo = ProdutoRepository()
cliente_repo = ClienteRepository()
fatura_repo = FaturaRepository()

# Inicializar casos de uso
criar_fatura_use_case = CriarFaturaUseCase(fatura_repo, cliente_repo, produto_repo)
finalizar_fatura_use_case = FinalizarFaturaUseCase(fatura_repo)
listar_faturas_use_case = ListarFaturasUseCase(fatura_repo)


# ========================================
# Rotas de Visualização
# ========================================

@app.route('/')
def index():
    """Dashboard principal"""
    try:
        produtos = produto_repo.listar_todos()
        clientes = cliente_repo.listar_todos()
        faturas = listar_faturas_use_case.executar_todas()
        
        total_faturamento = sum(f.calcular_total() for f in faturas if f.status == 'FINALIZADA')
        
        return render_template('index.html',
            total_produtos=len(produtos),
            total_clientes=len(clientes),
            total_faturas=len(faturas),
            faturamento_total=f'{total_faturamento:,.2f}'
        )
    except Exception as e:
        print(f"Erro ao carregar dashboard: {e}")
        return render_template('index.html', total_produtos=0, total_clientes=0, total_faturas=0)


@app.route('/produtos')
def produtos():
    """Página de Produtos"""
    return render_template('produtos.html')


@app.route('/clientes')
def clientes():
    """Página de Clientes"""
    return render_template('clientes.html')


@app.route('/faturas')
def faturas():
    """Página de Faturas"""
    return render_template('faturas.html')


# ========================================
# API Routes - Produtos
# ========================================

@app.route('/api/produtos', methods=['GET'])
def api_get_produtos():
    """Listar todos os produtos"""
    try:
        produtos = produto_repo.listar_todos()
        return jsonify([{
            'id': p.id,
            'nome': p.nome,
            'preco_unitario': p.preco_unitario,
            'descricao': p.descricao,
            'ativo': p.ativo
        } for p in produtos])
    except Exception as e:
        print(f"Erro ao listar produtos: {e}")
        return jsonify({'erro': str(e)}), 500


@app.route('/api/produtos', methods=['POST'])
def api_criar_produto():
    """Criar um novo produto"""
    try:
        data = request.get_json()
        produto = Produto(
            id=None,
            nome=data.get('nome'),
            preco_unitario=float(data.get('preco_unitario')),
            descricao=data.get('descricao', '')
        )
        produto_repo.salvar(produto)
        return jsonify({'id': produto.id, 'mensagem': 'Produto criado com sucesso'}), 201
    except Exception as e:
        print(f"Erro ao criar produto: {e}")
        return jsonify({'erro': str(e)}), 400


# ========================================
# API Routes - Clientes
# ========================================

@app.route('/api/clientes', methods=['GET'])
def api_get_clientes():
    """Listar todos os clientes"""
    try:
        clientes = cliente_repo.listar_todos()
        return jsonify([{
            'id': c.id,
            'nome': c.nome,
            'email': c.email,
            'cpf_cnpj': c.cpf_cnpj,
            'ativo': c.ativo
        } for c in clientes])
    except Exception as e:
        print(f"Erro ao listar clientes: {e}")
        return jsonify({'erro': str(e)}), 500


@app.route('/api/clientes', methods=['POST'])
def api_criar_cliente():
    """Criar um novo cliente"""
    try:
        data = request.get_json()
        cliente = Cliente(
            id=None,
            nome=data.get('nome'),
            email=data.get('email'),
            cpf_cnpj=data.get('cpf_cnpj')
        )
        cliente_repo.salvar(cliente)
        return jsonify({'id': cliente.id, 'mensagem': 'Cliente criado com sucesso'}), 201
    except Exception as e:
        print(f"Erro ao criar cliente: {e}")
        return jsonify({'erro': str(e)}), 400


# ========================================
# API Routes - Faturas
# ========================================

@app.route('/api/faturas', methods=['GET'])
def api_get_faturas():
    """Listar todas as faturas"""
    try:
        faturas = listar_faturas_use_case.executar_todas()
        return jsonify([{
            'id': f.id,
            'cliente': {'id': f.cliente.id, 'nome': f.cliente.nome},
            'total': f.calcular_total(),
            'subtotal': f.calcular_subtotal(),
            'desconto': f.desconto,
            'status': f.status,
            'data_criacao': f.data_criacao.isoformat(),
            'quantidade_itens': len(f.itens)
        } for f in faturas])
    except Exception as e:
        print(f"Erro ao listar faturas: {e}")
        return jsonify({'erro': str(e)}), 500


@app.route('/api/faturas', methods=['POST'])
def api_criar_fatura():
    """Criar uma nova fatura"""
    try:
        data = request.get_json()
        fatura = criar_fatura_use_case.executar(
            cliente_id=data.get('cliente_id'),
            itens_data=data.get('itens', []),
            desconto=float(data.get('desconto', 0))
        )
        return jsonify({
            'id': fatura.id,
            'mensagem': 'Fatura criada com sucesso',
            'total': fatura.calcular_total()
        }), 201
    except Exception as e:
        print(f"Erro ao criar fatura: {e}")
        return jsonify({'erro': str(e)}), 400


@app.route('/api/faturas/<int:id>/finalizar', methods=['POST'])
def api_finalizar_fatura(id):
    """Finalizar uma fatura"""
    try:
        fatura = finalizar_fatura_use_case.executar(id)
        return jsonify({
            'id': fatura.id,
            'mensagem': 'Fatura finalizada com sucesso',
            'status': fatura.status,
            'total': fatura.calcular_total()
        })
    except Exception as e:
        print(f"Erro ao finalizar fatura: {e}")
        return jsonify({'erro': str(e)}), 400


# ========================================
# Handler de Erros
# ========================================

@app.errorhandler(404)
def not_found(error):
    """Página não encontrada"""
    return jsonify({'erro': 'Recurso não encontrado'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Erro interno do servidor"""
    return jsonify({'erro': 'Erro interno do servidor'}), 500


if __name__ == '__main__':
    print("🚀 Iniciando Sistema de Faturamento...")
    print("📍 Acesse: http://localhost:5000")
    app.run(debug=True, host='localhost', port=5000)
