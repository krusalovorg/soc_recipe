import sys
from time import time

from flask import Flask, jsonify, make_response, request, abort
from flask_migrate import Migrate

from data.__models import SqlBase, User, Recipe

import sqlalchemy
from sqlalchemy.orm import sessionmaker

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


# Регистрация пользователя
@app.route('/api/user_reg', methods=['post'])
def user_reg():
    name = request.json["name"]
    surname = request.json["surname"]
    email = request.json["email"]
    password = request.json["password"]
    user = User.query.filter_by(email=email).first()  # Проверка есть ли пользователь в БД
    if user:
        return make_response("User alredy exist")
    if name and surname and email and password:
        new_user = User(name=name, surname=surname, email=email, password=User.set_password(password),
                        created_date=time())
        session.add(new_user)
        session.commit()
    else:
        return abort(400)


# Добавить рецепт
@app.route('/api/add_recipes/<int:user_id>', methods=['POST'])
def add_recipes(user_id):
    pass


# Удалить рецепт
@app.route('/api/rem_recipes', methods=['DELETE'])
def rem_recipes():
    pass


# Изменить рецепт
@app.route('/api/edit_recipes', methods=['PUT'])
def edit_recipes():
    pass


# Получить рецепт
@app.route('/api/get_recipes', methods=['GET'])
def get_recipes():
    return jsonify({'recipe': recipe})


if __name__ == '__main__':
    app.run(debug=True, port=8000)
