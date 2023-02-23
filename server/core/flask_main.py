import sys

from flask import Flask, jsonify, flash, render_template, url_for, request, redirect, abort
from flask_migrate import Migrate

from data.__models import SqlBase

import sqlalchemy
from sqlalchemy.orm import sessionmaker

from database import Database

app = Flask(__name__)
app.config['SECRET_KEY'] = "SECRET_VERY_SECRET_KEY"

engine = sqlalchemy.create_engine('sqlite:///db/db.db?check_same_thread=False', echo=False)
SqlBase.metadata.create_all(engine)
SqlBase.metadata.bind = engine
Session = sessionmaker(bind=engine)
session = Session()

migrate = Migrate(app, engine)


""" Пример json для добавления"""
recipe = {
    "user": {
        "recipe": [
            {"text": "text"},
            {"text": "картинка #1"},
            {"text": "text"},
        ],
        "comments": [],
        "likes": [],
    }
}


@app.route('/', methods=['POST', 'GET'])
def index():
    pass


# Добавить рецепт
@app.route('api/add_recipes', methods=['post'])
def add_recipes():
    return


# Удалить рецепт
@app.route('api/rem_recipes', methods=['post', 'get'])
def rem_recipes():
    return


# Изменить рецепт
@app.route('api/edit_recipes', methods=['post', 'get'])
def edit_recipes():
    return


# Получить рецепт
@app.route('api/get_recipes', methods=['get'])
def get_recipes():
    return jsonify({'recipe': recipe})


if __name__ == '__main__':
    app.run(debug=True, port=8000)
