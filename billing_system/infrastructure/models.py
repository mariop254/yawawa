"""Modelos SQLAlchemy - Representação do banco de dados"""

from datetime import datetime
from .database import db


class ProdutoModel(db.Model):
    """Modelo de Produto no banco de dados"""
    __tablename__ = 'produtos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    preco_unitario = db.Column(db.Float, nullable=False)
    descricao = db.Column(db.Text)
    ativo = db.Column(db.Boolean, default=True)
    criado_em = db.Column(db.DateTime, default=datetime.now)
    
    itens_fatura = db.relationship('ItemFaturaModel', backref='produto', lazy=True, cascade='all, delete-orphan')


class ClienteModel(db.Model):
    """Modelo de Cliente no banco de dados"""
    __tablename__ = 'clientes'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    cpf_cnpj = db.Column(db.String(20), unique=True, nullable=False)
    ativo = db.Column(db.Boolean, default=True)
    criado_em = db.Column(db.DateTime, default=datetime.now)
    
    faturas = db.relationship('FaturaModel', backref='cliente', lazy=True, cascade='all, delete-orphan')


class FaturaModel(db.Model):
    """Modelo de Fatura no banco de dados"""
    __tablename__ = 'faturas'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    desconto = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='RASCUNHO')  # RASCUNHO, FINALIZADA, CANCELADA
    data_criacao = db.Column(db.DateTime, default=datetime.now)
    data_finalizacao = db.Column(db.DateTime)
    
    itens = db.relationship('ItemFaturaModel', backref='fatura', lazy=True, cascade='all, delete-orphan')


class ItemFaturaModel(db.Model):
    """Modelo de Item dentro de uma Fatura"""
    __tablename__ = 'itens_fatura'
    
    id = db.Column(db.Integer, primary_key=True)
    fatura_id = db.Column(db.Integer, db.ForeignKey('faturas.id'), nullable=False)
    produto_id = db.Column(db.Integer, db.ForeignKey('produtos.id'), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    preco_unitario_snapshot = db.Column(db.Float, nullable=False)  # Captura o preço no momento da fatura
