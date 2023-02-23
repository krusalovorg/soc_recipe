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
        new_user = User(name=name, surname=surname, email=email, password=User.set_password(password))
        session.add(new_user)
        session.commit()
    else:
        abort(400)


# Добавить рецепт
@app.route('/api/add_recipes/<int:user_id>', methods=['POST'])
def add_recipes(user_id):
    if not request.json:
        abort(400)
    title = request.json["title"]
    category = request.json["category"]
    calories = request.json["calories"]
    proteins = request.json["proteins"]
    fats = request.json["fats"]
    carbohydrates = request.json["carbohydrates"]
    ingredients = request.json["ingredients"]
    user = User.query.filter_by(id=user_id).first()
    if user:
        new_recipe = Recipe(title=title, category=category, time=time(),
                            calories=calories, proteins=proteins, fats=fats,
                            carbohydrates=carbohydrates)
        session.add(new_recipe)
        session.commit()
        if ingredients:
            new_recipe.ingredients.extend(ingredients)
            session.commit()
    return make_response("Successful add")

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
    recipe = session.query(Recipe).all()
    print(recipe)
    return jsonify({'recipe': recipe})


if __name__ == '__main__':
    app.run(debug=True, port=8000)
