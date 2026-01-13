#!/usr/bin/env node

/**
 * Sistema de Build - Dashboard Mpinda Evata
 * Concatena arquivos CSS e JavaScript modulares em arquivos únicos para produção
 */

const fs = require('fs');
const path = require('path');

class DashboardBuilder {
    constructor() {
        this.rootDir = path.resolve(__dirname, '../..');
        this.srcDir = path.resolve(__dirname, '..');
        this.distDir = path.resolve(__dirname, 'dist');
        
        // Ordem de carregamento dos arquivos CSS
        this.cssOrder = [
            'styles/core/base.css',
            'styles/core/layout.css',
            'styles/core/components.css',
            'styles/modules/navigation.css',
            'styles/modules/rh.css',
            'styles/modules/financeiro.css',
            'styles/modules/vendas.css'
        ];
        
        // Ordem de carregamento dos arquivos JavaScript
        this.jsOrder = [
            'scripts/utils/helpers.js',
            'scripts/utils/dom.js',
            'scripts/utils/data.js',
            'scripts/components/notifications.js',
            'scripts/components/modals.js',
            'scripts/components/charts.js',
            'scripts/modules/navigation.js',
            'scripts/modules/rh.js',
            'scripts/modules/financeiro.js',
            'scripts/modules/vendas.js',
            'core/main.js'
        ];
    }

    /**
     * Cria o diretório dist se não existir
     */
    ensureDistDirectory() {
        if (!fs.existsSync(this.distDir)) {
            fs.mkdirSync(this.distDir, { recursive: true });
            console.log('📁 Diretório dist/ criado');
        }
    }

    /**
     * Lê um arquivo e retorna seu conteúdo
     */
    readFile(filePath) {
        const fullPath = path.resolve(this.srcDir, filePath);
        
        if (!fs.existsSync(fullPath)) {
            console.warn(`⚠️  Arquivo não encontrado: ${filePath}`);
            return `/* Arquivo não encontrado: ${filePath} */\n`;
        }
        
        try {
            const content = fs.readFileSync(fullPath, 'utf8');
            console.log(`✅ Lido: ${filePath}`);
            return content;
        } catch (error) {
            console.error(`❌ Erro ao ler ${filePath}:`, error.message);
            return `/* Erro ao ler: ${filePath} - ${error.message} */\n`;
        }
    }

    /**
     * Concatena arquivos CSS na ordem especificada
     */
    async concatenateCSS() {
        console.log('\n🎨 Concatenando arquivos CSS...');
        
        let concatenatedCSS = '';
        
        // Header do arquivo gerado
        concatenatedCSS += `/*\n`;
        concatenatedCSS += ` * Dashboard Mpinda Evata - Estilos Concatenados\n`;
        concatenatedCSS += ` * Gerado automaticamente em: ${new Date().toISOString()}\n`;
        concatenatedCSS += ` * \n`;
        concatenatedCSS += ` * Ordem de concatenação:\n`;
        this.cssOrder.forEach((file, index) => {
            concatenatedCSS += ` * ${index + 1}. ${file}\n`;
        });
        concatenatedCSS += ` */\n\n`;
        
        // Concatena cada arquivo CSS
        this.cssOrder.forEach((cssFile, index) => {
            concatenatedCSS += `/* ========================================\n`;
            concatenatedCSS += ` * ${index + 1}. ${cssFile}\n`;
            concatenatedCSS += ` * ======================================== */\n\n`;
            
            const content = this.readFile(cssFile);
            concatenatedCSS += content;
            concatenatedCSS += '\n\n';
        });
        
        // Escreve o arquivo concatenado
        const outputPath = path.resolve(this.distDir, 'styles.css');
        
        try {
            fs.writeFileSync(outputPath, concatenatedCSS, 'utf8');
            console.log(`✅ CSS concatenado salvo em: ${outputPath}`);
            
            // Estatísticas
            const stats = fs.statSync(outputPath);
            const sizeKB = (stats.size / 1024).toFixed(2);
            console.log(`📊 Tamanho do arquivo: ${sizeKB} KB`);
            
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar CSS concatenado:', error.message);
            return false;
        }
    }

    /**
     * Concatena arquivos JavaScript na ordem especificada
     */
    async concatenateJS() {
        console.log('\n📜 Concatenando arquivos JavaScript...');
        
        let concatenatedJS = '';
        
        // Header do arquivo gerado
        concatenatedJS += `/*\n`;
        concatenatedJS += ` * Dashboard Mpinda Evata - Scripts Concatenados\n`;
        concatenatedJS += ` * Gerado automaticamente em: ${new Date().toISOString()}\n`;
        concatenatedJS += ` * \n`;
        concatenatedJS += ` * Ordem de concatenação:\n`;
        this.jsOrder.forEach((file, index) => {
            concatenatedJS += ` * ${index + 1}. ${file}\n`;
        });
        concatenatedJS += ` */\n\n`;
        
        // Concatena cada arquivo JavaScript
        this.jsOrder.forEach((jsFile, index) => {
            concatenatedJS += `/* ========================================\n`;
            concatenatedJS += ` * ${index + 1}. ${jsFile}\n`;
            concatenatedJS += ` * ======================================== */\n\n`;
            
            const content = this.readFile(jsFile);
            concatenatedJS += content;
            concatenatedJS += '\n\n';
        });
        
        // Escreve o arquivo concatenado
        const outputPath = path.resolve(this.distDir, 'script.js');
        
        try {
            fs.writeFileSync(outputPath, concatenatedJS, 'utf8');
            console.log(`✅ JavaScript concatenado salvo em: ${outputPath}`);
            
            // Estatísticas
            const stats = fs.statSync(outputPath);
            const sizeKB = (stats.size / 1024).toFixed(2);
            console.log(`📊 Tamanho do arquivo: ${sizeKB} KB`);
            
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar JavaScript concatenado:', error.message);
            return false;
        }
    }

    /**
     * Copia e ajusta o arquivo HTML principal
     */
    async copyHTML() {
        console.log('\n📄 Processando arquivo HTML...');
        
        const sourceHTML = path.resolve(this.srcDir, 'core/index.html');
        const fallbackHTML = path.resolve(this.rootDir, 'index.html');
        const outputHTML = path.resolve(this.distDir, 'index.html');
        
        let htmlPath = sourceHTML;
        
        // Se o HTML modular não existe, usa o original como fallback
        if (!fs.existsSync(sourceHTML)) {
            console.log('⚠️  HTML modular não encontrado, usando original como base');
            htmlPath = fallbackHTML;
        }
        
        if (!fs.existsSync(htmlPath)) {
            console.error('❌ Nenhum arquivo HTML encontrado');
            return false;
        }
        
        try {
            let htmlContent = fs.readFileSync(htmlPath, 'utf8');
            
            // Ajusta as referências para os arquivos concatenados
            htmlContent = htmlContent.replace(
                /<link[^>]*href=['"](.*?styles.*?\.css)['"][^>]*>/gi,
                '<link rel="stylesheet" href="styles.css">'
            );
            
            htmlContent = htmlContent.replace(
                /<script[^>]*src=['"](.*?script.*?\.js)['"][^>]*><\/script>/gi,
                '<script src="script.js"></script>'
            );
            
            // Adiciona comentário indicando que é versão de produção
            const buildComment = `<!-- Dashboard Mpinda Evata - Versão de Produção -->\n<!-- Gerado em: ${new Date().toISOString()} -->\n`;
            htmlContent = htmlContent.replace('<!DOCTYPE html>', buildComment + '<!DOCTYPE html>');
            
            fs.writeFileSync(outputHTML, htmlContent, 'utf8');
            console.log(`✅ HTML processado salvo em: ${outputHTML}`);
            
            return true;
        } catch (error) {
            console.error('❌ Erro ao processar HTML:', error.message);
            return false;
        }
    }

    /**
     * Copia arquivos de dados
     */
    async copyAssets() {
        console.log('\n📦 Copiando assets...');
        
        const dataSource = path.resolve(this.srcDir, 'assets/data/sample-data.json');
        const dataFallback = path.resolve(this.rootDir, 'data-example.json');
        const dataOutput = path.resolve(this.distDir, 'data-example.json');
        
        let dataPath = dataSource;
        
        // Se o arquivo modular não existe, usa o original
        if (!fs.existsSync(dataSource)) {
            dataPath = dataFallback;
        }
        
        if (fs.existsSync(dataPath)) {
            try {
                fs.copyFileSync(dataPath, dataOutput);
                console.log(`✅ Dados copiados: ${path.basename(dataPath)}`);
            } catch (error) {
                console.error('❌ Erro ao copiar dados:', error.message);
            }
        }
    }

    /**
     * Executa o build completo
     */
    async build() {
        console.log('🚀 Dashboard Mpinda Evata - Sistema de Build');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📁 Diretório fonte: ${this.srcDir}`);
        console.log(`📁 Diretório destino: ${this.distDir}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        this.ensureDistDirectory();
        
        const results = await Promise.all([
            this.concatenateCSS(),
            this.concatenateJS(),
            this.copyHTML(),
            this.copyAssets()
        ]);
        
        const success = results.every(result => result !== false);
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        if (success) {
            console.log('✅ Build concluído com sucesso!');
            console.log(`📁 Arquivos gerados em: ${this.distDir}`);
            console.log('💡 Para testar, sirva os arquivos da pasta dist/');
        } else {
            console.log('❌ Build concluído com erros');
            console.log('⚠️  Verifique os logs acima para detalhes');
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        return success;
    }
}

// Executa o build se chamado diretamente
if (require.main === module) {
    const builder = new DashboardBuilder();
    builder.build().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('❌ Erro fatal no build:', error);
        process.exit(1);
    });
}

module.exports = DashboardBuilder;