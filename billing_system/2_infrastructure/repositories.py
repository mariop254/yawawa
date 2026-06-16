"""Implementação dos Repositories com SQLAlchemy e SQLite"""

from typing import List, Optional
from ..1_core.domain.entities import Produto, Cliente, Fatura, ItemFatura
from ..1_core.application.repositories import IProdutoRepository, IClienteRepository, IFaturaRepository
from .models import ProdutoModel, ClienteModel, FaturaModel, ItemFaturaModel
from .database import db


class ProdutoRepository(IProdutoRepository):
    """Implementação do repositório de Produtos"""
    
    def salvar(self, produto: Produto) -> None:
        model = ProdutoModel(
            id=produto.id,
            nome=produto.nome,
            preco_unitario=produto.preco_unitario,
            descricao=produto.descricao,
            ativo=produto.ativo
        )
        db.session.add(model)
        db.session.commit()
        produto.id = model.id
    
    def obter_por_id(self, id: int) -> Optional[Produto]:
        model = ProdutoModel.query.get(id)
        if not model:
            return None
        return Produto(
            id=model.id,
            nome=model.nome,
            preco_unitario=model.preco_unitario,
            descricao=model.descricao
        )
    
    def listar_todos(self) -> List[Produto]:
        models = ProdutoModel.query.filter_by(ativo=True).all()
        return [
            Produto(
                id=model.id,
                nome=model.nome,
                preco_unitario=model.preco_unitario,
                descricao=model.descricao
            )
            for model in models
        ]
    
    def deletar(self, id: int) -> None:
        model = ProdutoModel.query.get(id)
        if model:
            db.session.delete(model)
            db.session.commit()


class ClienteRepository(IClienteRepository):
    """Implementação do repositório de Clientes"""
    
    def salvar(self, cliente: Cliente) -> None:
        model = ClienteModel(
            id=cliente.id if cliente.id != 0 else None,
            nome=cliente.nome,
            email=cliente.email,
            cpf_cnpj=cliente.cpf_cnpj,
            ativo=cliente.ativo
        )
        db.session.add(model)
        db.session.commit()
        cliente.id = model.id
    
    def obter_por_id(self, id: int) -> Optional[Cliente]:
        model = ClienteModel.query.get(id)
        if not model:
            return None
        return Cliente(
            id=model.id,
            nome=model.nome,
            email=model.email,
            cpf_cnpj=model.cpf_cnpj
        )
    
    def listar_todos(self) -> List[Cliente]:
        models = ClienteModel.query.filter_by(ativo=True).all()
        return [
            Cliente(
                id=model.id,
                nome=model.nome,
                email=model.email,
                cpf_cnpj=model.cpf_cnpj
            )
            for model in models
        ]
    
    def deletar(self, id: int) -> None:
        model = ClienteModel.query.get(id)
        if model:
            db.session.delete(model)
            db.session.commit()


class FaturaRepository(IFaturaRepository):
    """Implementação do repositório de Faturas"""
    
    def salvar(self, fatura: Fatura) -> None:
        model = FaturaModel(
            id=fatura.id if fatura.id != 0 else None,
            cliente_id=fatura.cliente.id,
            desconto=fatura.desconto,
            status=fatura.status,
            data_criacao=fatura.data_criacao
        )
        
        db.session.add(model)
        db.session.flush()
        
        # Salva os itens
        for item in fatura.itens:
            item_model = ItemFaturaModel(
                fatura_id=model.id,
                produto_id=item.produto.id,
                quantidade=item.quantidade,
                preco_unitario_snapshot=item.produto.preco_unitario
            )
            db.session.add(item_model)
        
        db.session.commit()
        fatura.id = model.id
    
    def obter_por_id(self, id: int) -> Optional[Fatura]:
        model = FaturaModel.query.get(id)
        if not model:
            return None
        
        cliente = Cliente(
            id=model.cliente.id,
            nome=model.cliente.nome,
            email=model.cliente.email,
            cpf_cnpj=model.cliente.cpf_cnpj
        )
        
        itens = []
        for item_model in model.itens:
            produto = Produto(
                id=item_model.produto.id,
                nome=item_model.produto.nome,
                preco_unitario=item_model.preco_unitario_snapshot,
                descricao=item_model.produto.descricao
            )
            item = ItemFatura(produto=produto, quantidade=item_model.quantidade)
            itens.append(item)
        
        fatura = Fatura(id=model.id, cliente=cliente, itens=itens, desconto=model.desconto)
        fatura.status = model.status
        fatura.data_criacao = model.data_criacao
        return fatura
    
    def listar_todas(self) -> List[Fatura]:
        models = FaturaModel.query.all()
        return [self._model_to_entity(model) for model in models]
    
    def listar_por_cliente(self, cliente_id: int) -> List[Fatura]:
        models = FaturaModel.query.filter_by(cliente_id=cliente_id).all()
        return [self._model_to_entity(model) for model in models]
    
    def deletar(self, id: int) -> None:
        model = FaturaModel.query.get(id)
        if model:
            db.session.delete(model)
            db.session.commit()
    
    def _model_to_entity(self, model: FaturaModel) -> Fatura:
        """Converte um modelo SQLAlchemy para entidade de domínio"""
        cliente = Cliente(
            id=model.cliente.id,
            nome=model.cliente.nome,
            email=model.cliente.email,
            cpf_cnpj=model.cliente.cpf_cnpj
        )
        
        itens = []
        for item_model in model.itens:
            produto = Produto(
                id=item_model.produto.id,
                nome=item_model.produto.nome,
                preco_unitario=item_model.preco_unitario_snapshot,
                descricao=item_model.produto.descricao
            )
            item = ItemFatura(produto=produto, quantidade=item_model.quantidade)
            itens.append(item)
        
        fatura = Fatura(id=model.id, cliente=cliente, itens=itens, desconto=model.desconto)
        fatura.status = model.status
        fatura.data_criacao = model.data_criacao
        return fatura
