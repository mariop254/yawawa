"""Configuração do banco de dados SQLite"""

from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

def init_db(app):
    """Inicializa o banco de dados"""
    db.init_app(app)
    with app.app_context():
        db.create_all()

def get_database_url():
    """Retorna a URL do banco de dados"""
    db_path = os.path.join(os.path.dirname(__file__), '../data/faturamento.db')
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    return f'sqlite:///{db_path}'
