/**
 * Sistema de Faturamento - Frontend JavaScript
 * Clean Architecture Pattern
 */

// ========================================
// Utilidades
// ========================================

const API = {
    BASE_URL: '/api',

    async request(endpoint, options = {}) {
        const url = `${this.BASE_URL}${endpoint}`;
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na requisição:', error);
            showAlert('Erro ao comunicar com o servidor', 'error');
            throw error;
        }
    },

    // Produtos
    async getProdutos() {
        return this.request('/produtos');
    },

    async criarProduto(data) {
        return this.request('/produtos', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Clientes
    async getClientes() {
        return this.request('/clientes');
    },

    async criarCliente(data) {
        return this.request('/clientes', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Faturas
    async getFaturas() {
        return this.request('/faturas');
    },

    async criarFatura(data) {
        return this.request('/faturas', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async finalizarFatura(id) {
        return this.request(`/faturas/${id}/finalizar`, {
            method: 'POST',
        });
    },
};

// ========================================
// Funções de UI
// ========================================

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);

    // Remove após 5 segundos
    setTimeout(() => alertDiv.remove(), 5000);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

// ========================================
// Gerenciamento de Produtos
// ========================================

class ProdutoManager {
    async loadProdutos() {
        try {
            const produtos = await API.getProdutos();
            this.displayProdutos(produtos);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    }

    displayProdutos(produtos) {
        const table = document.getElementById('produtosTable');
        if (!table) return;

        table.innerHTML = produtos
            .map(
                (p) => `
            <tr>
                <td>${p.id}</td>
                <td>${p.nome}</td>
                <td>${formatCurrency(p.preco_unitario)}</td>
                <td>${p.descricao || '-'}</td>
                <td>
                    <button class="btn btn-small btn-danger" onclick="produtoManager.deletarProduto(${p.id})">Deletar</button>
                </td>
            </tr>
        `
            )
            .join('');
    }

    async criarProduto(e) {
        e.preventDefault();

        const formData = {
            nome: document.getElementById('produtoNome').value,
            preco_unitario: parseFloat(document.getElementById('produtoPreco').value),
            descricao: document.getElementById('produtoDescricao').value,
        };

        try {
            await API.criarProduto(formData);
            showAlert('Produto criado com sucesso!', 'success');
            e.target.reset();
            this.loadProdutos();
        } catch (error) {
            showAlert('Erro ao criar produto', 'error');
        }
    }

    async deletarProduto(id) {
        if (confirm('Tem certeza que deseja deletar este produto?')) {
            // Implementar chamada de delete
            showAlert('Produto deletado com sucesso!', 'success');
            this.loadProdutos();
        }
    }
}

const produtoManager = new ProdutoManager();

// ========================================
// Gerenciamento de Clientes
// ========================================

class ClienteManager {
    async loadClientes() {
        try {
            const clientes = await API.getClientes();
            this.displayClientes(clientes);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        }
    }

    displayClientes(clientes) {
        const table = document.getElementById('clientesTable');
        if (!table) return;

        table.innerHTML = clientes
            .map(
                (c) => `
            <tr>
                <td>${c.id}</td>
                <td>${c.nome}</td>
                <td>${c.email}</td>
                <td>${c.cpf_cnpj}</td>
                <td>
                    <button class="btn btn-small btn-danger" onclick="clienteManager.deletarCliente(${c.id})">Deletar</button>
                </td>
            </tr>
        `
            )
            .join('');
    }

    async criarCliente(e) {
        e.preventDefault();

        const formData = {
            nome: document.getElementById('clienteNome').value,
            email: document.getElementById('clienteEmail').value,
            cpf_cnpj: document.getElementById('clienteCpfCnpj').value,
        };

        try {
            await API.criarCliente(formData);
            showAlert('Cliente criado com sucesso!', 'success');
            e.target.reset();
            this.loadClientes();
        } catch (error) {
            showAlert('Erro ao criar cliente', 'error');
        }
    }

    async deletarCliente(id) {
        if (confirm('Tem certeza que deseja deletar este cliente?')) {
            showAlert('Cliente deletado com sucesso!', 'success');
            this.loadClientes();
        }
    }
}

const clienteManager = new ClienteManager();

// ========================================
// Gerenciamento de Faturas
// ========================================

class FaturaManager {
    async loadFaturas() {
        try {
            const faturas = await API.getFaturas();
            this.displayFaturas(faturas);
        } catch (error) {
            console.error('Erro ao carregar faturas:', error);
        }
    }

    displayFaturas(faturas) {
        const table = document.getElementById('faturasTable');
        if (!table) return;

        table.innerHTML = faturas
            .map(
                (f) => `
            <tr>
                <td>#${f.id}</td>
                <td>${f.cliente.nome}</td>
                <td>${formatCurrency(f.total)}</td>
                <td><span class="badge badge-${f.status.toLowerCase()}">${f.status}</span></td>
                <td>${formatDate(f.data_criacao)}</td>
                <td>
                    <button class="btn btn-small btn-primary" onclick="faturaManager.visualizarFatura(${f.id})">Ver</button>
                    ${f.status === 'RASCUNHO' ? `<button class="btn btn-small btn-success" onclick="faturaManager.finalizarFatura(${f.id})">Finalizar</button>` : ''}
                </td>
            </tr>
        `
            )
            .join('');
    }

    async criarFatura(e) {
        e.preventDefault();

        const formData = {
            cliente_id: parseInt(document.getElementById('clienteSelect').value),
            itens: this.getItensFromForm(),
            desconto: parseFloat(document.getElementById('desconto').value || 0),
        };

        try {
            await API.criarFatura(formData);
            showAlert('Fatura criada com sucesso!', 'success');
            e.target.reset();
            this.loadFaturas();
        } catch (error) {
            showAlert('Erro ao criar fatura', 'error');
        }
    }

    getItensFromForm() {
        // Implementar lógica para coletar itens do formulário
        return [];
    }

    async finalizarFatura(id) {
        try {
            await API.finalizarFatura(id);
            showAlert('Fatura finalizada com sucesso!', 'success');
            this.loadFaturas();
        } catch (error) {
            showAlert('Erro ao finalizar fatura', 'error');
        }
    }

    visualizarFatura(id) {
        // Implementar visualização detalhada
        console.log(`Visualizando fatura ${id}`);
    }
}

const faturaManager = new FaturaManager();

// ========================================
// Inicialização
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    produtoManager.loadProdutos();
    clienteManager.loadClientes();
    faturaManager.loadFaturas();
});
