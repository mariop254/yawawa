"""Interfaces (Contratos) do Repository Pattern"""

from abc import ABC, abstractmethod
from typing import List, Optional
from ..domain.entities import Produto, Cliente, Fatura


class IProdutoRepository(ABC):
    """Contrato para operações com Produtos"""
    
    @abstractmethod
    def salvar(self, produto: Produto) -> None:
        pass
    
    @abstractmethod
    def obter_por_id(self, id: int) -> Optional[Produto]:
        pass
    
    @abstractmethod
    def listar_todos(self) -> List[Produto]:
        pass
    
    @abstractmethod
    def deletar(self, id: int) -> None:
        pass


class IClienteRepository(ABC):
    """Contrato para operações com Clientes"""
    
    @abstractmethod
    def salvar(self, cliente: Cliente) -> None:
        pass
    
    @abstractmethod
    def obter_por_id(self, id: int) -> Optional[Cliente]:
        pass
    
    @abstractmethod
    def listar_todos(self) -> List[Cliente]:
        pass
    
    @abstractmethod
    def deletar(self, id: int) -> None:
        pass


class IFaturaRepository(ABC):
    """Contrato para operações com Faturas"""
    
    @abstractmethod
    def salvar(self, fatura: Fatura) -> None:
        pass
    
    @abstractmethod
    def obter_por_id(self, id: int) -> Optional[Fatura]:
        pass
    
    @abstractmethod
    def listar_todas(self) -> List[Fatura]:
        pass
    
    @abstractmethod
    def listar_por_cliente(self, cliente_id: int) -> List[Fatura]:
        pass
    
    @abstractmethod
    def deletar(self, id: int) -> None:
        pass
