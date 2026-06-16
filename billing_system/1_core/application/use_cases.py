"""Casos de Uso (Use Cases) - Orquestra o fluxo de negócio"""

from typing import List, Dict, Any
from ..domain.entities import Fatura, Cliente, Produto, ItemFatura
from .repositories import IFaturaRepository, IProdutoRepository, IClienteRepository


class CriarFaturaUseCase:
    """Caso de Uso para criar uma nova fatura"""
    
    def __init__(
        self,
        fatura_repo: IFaturaRepository,
        cliente_repo: IClienteRepository,
        produto_repo: IProdutoRepository
    ):
        self.fatura_repo = fatura_repo
        self.cliente_repo = cliente_repo
        self.produto_repo = produto_repo
    
    def executar(self, cliente_id: int, itens_data: List[Dict[str, Any]], desconto: float = 0.0) -> Fatura:
        """
        Executa o caso de uso de criar uma fatura
        
        Args:
            cliente_id: ID do cliente
            itens_data: Lista de dicts com {"produto_id": int, "quantidade": int}
            desconto: Desconto total da fatura
        
        Returns:
            Fatura criada
        """
        # Busca o cliente
        cliente = self.cliente_repo.obter_por_id(cliente_id)
        if not cliente:
            raise ValueError(f"Cliente com ID {cliente_id} não encontrado")
        
        # Cria a fatura
        fatura = Fatura(id=None, cliente=cliente, desconto=desconto)
        
        # Adiciona os itens
        for item_data in itens_data:
            produto = self.produto_repo.obter_por_id(item_data["produto_id"])
            if not produto:
                raise ValueError(f"Produto com ID {item_data['produto_id']} não encontrado")
            
            item = ItemFatura(produto=produto, quantidade=item_data["quantidade"])
            fatura.adicionar_item(item)
        
        # Salva a fatura
        self.fatura_repo.salvar(fatura)
        return fatura


class FinalizarFaturaUseCase:
    """Caso de Uso para finalizar uma fatura"""
    
    def __init__(self, fatura_repo: IFaturaRepository):
        self.fatura_repo = fatura_repo
    
    def executar(self, fatura_id: int) -> Fatura:
        """
        Finaliza uma fatura
        
        Args:
            fatura_id: ID da fatura a finalizar
        
        Returns:
            Fatura finalizada
        """
        fatura = self.fatura_repo.obter_por_id(fatura_id)
        if not fatura:
            raise ValueError(f"Fatura com ID {fatura_id} não encontrada")
        
        fatura.finalizar()
        self.fatura_repo.salvar(fatura)
        return fatura


class ListarFaturasUseCase:
    """Caso de Uso para listar faturas"""
    
    def __init__(self, fatura_repo: IFaturaRepository):
        self.fatura_repo = fatura_repo
    
    def executar_todas(self) -> List[Fatura]:
        """Lista todas as faturas"""
        return self.fatura_repo.listar_todas()
    
    def executar_por_cliente(self, cliente_id: int) -> List[Fatura]:
        """Lista faturas de um cliente específico"""
        return self.fatura_repo.listar_por_cliente(cliente_id)
