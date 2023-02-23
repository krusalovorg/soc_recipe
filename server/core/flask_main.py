import sys

from flask import Flask, jsonify

from database import Database

app = Flask(__name__)
app.config['SECRET_KEY'] = "SECRET_VERY_SECRET_KEY"


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
