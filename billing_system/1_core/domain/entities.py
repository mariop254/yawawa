"""Entidades do Domínio - Representam o negócio puro"""

from datetime import datetime
from typing import List


class Produto:
    """Entidade que representa um Produto"""
    
    def __init__(self, id: int, nome: str, preco_unitario: float, descricao: str = ""):
        self.id = id
        self.nome = nome
        self.preco_unitario = preco_unitario
        self.descricao = descricao
        self.ativo = True


class Cliente:
    """Entidade que representa um Cliente"""
    
    def __init__(self, id: int, nome: str, email: str, cpf_cnpj: str):
        self.id = id
        self.nome = nome
        self.email = email
        self.cpf_cnpj = cpf_cnpj
        self.ativo = True


class ItemFatura:
    """Representa um item dentro de uma Fatura"""
    
    def __init__(self, produto: Produto, quantidade: int):
        self.produto = produto
        self.quantidade = quantidade
    
    def calcular_subtotal(self) -> float:
        """Calcula o subtotal do item (Preço × Quantidade)"""
        return self.produto.preco_unitario * self.quantidade


class Fatura:
    """Entidade que representa uma Fatura"""
    
    def __init__(self, id: int, cliente: Cliente, itens: List[ItemFatura] = None, desconto: float = 0.0):
        self.id = id
        self.cliente = cliente
        self.itens = itens or []
        self.desconto = desconto
        self.data_criacao = datetime.now()
        self.status = "RASCUNHO"  # RASCUNHO, FINALIZADA, CANCELADA
    
    def adicionar_item(self, item: ItemFatura) -> None:
        """Adiciona um item à fatura"""
        if self.status != "RASCUNHO":
            raise ValueError("Não é possível adicionar itens em uma fatura já finalizada")
        self.itens.append(item)
    
    def calcular_subtotal(self) -> float:
        """Calcula o subtotal antes do desconto"""
        return sum(item.calcular_subtotal() for item in self.itens)
    
    def calcular_total(self) -> float:
        """Calcula o total da fatura: Σ(PreçoUnitário × Quantidade) − Desconto"""
        subtotal = self.calcular_subtotal()
        return max(0, subtotal - self.desconto)  # Total nunca pode ser negativo
    
    def finalizar(self) -> None:
        """Finaliza a fatura"""
        if not self.itens:
            raise ValueError("Não é possível finalizar uma fatura sem itens")
        self.status = "FINALIZADA"
    
    def cancelar(self) -> None:
        """Cancela a fatura"""
        self.status = "CANCELADA"
