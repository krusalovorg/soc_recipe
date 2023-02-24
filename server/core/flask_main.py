import random

from flask import Flask, jsonify, make_response, request, abort, session as ses
from flask_migrate import Migrate

from data.__models import SqlBase, User, Recipe

import sqlalchemy
from sqlalchemy.orm import sessionmaker

from fuzzywuzzy import fuzz

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


# Логин
@app.route("/api/user_login", methods=["POST", 'GET'])
def login():
    # if not request.json:
    #     abort(400)
    users = session.query(User).all()
    email = request.json["email"]
    password = request.json["password"]
    for user in users:
        if user.email == email and user.check_password(password):
            super_secret = "H@S213s$-1" + email + user.hashed_password
            sshkey = ""
            for i in range(24):
                sshkey += random.choice(super_secret)
                ses['user_id'] = {"user_id": user.id, "key": sshkey}
    return jsonify({'status': True, "sshkey": sshkey})


# Регистрация пользователя
@app.route('/api/user_reg', methods=['post'])
def user_reg():
    if not request.json:
        abort(400)
    name = request.json["name"]
    surname = request.json["surname"]
    email = request.json["email"]
    password = request.json["password"]
    user = User.query.filter_by(email=email).first()  # Проверка есть ли пользователь в БД
    if user:
        return jsonify({'status': False})
    if name and surname and email and password:
        new_user = User(name=name, surname=surname, email=email, password=User.set_password(password))
        session.add(new_user)
        session.commit()
    else:
        abort(400)
    return jsonify({'status': True})


# Добавить рецепт
@app.route('/api/add_recipes/<int:user_id>', methods=['POST'])
def add_recipes(user_id):
    if not request.json:
        abort(400)
    title = request.json["title"]
    category = request.json["category"]
    time = request.json["time"]
    steps = request.json["steps"]
    calories = request.json["calories"]
    proteins = request.json["proteins"]
    fats = request.json["fats"]
    carbohydrates = request.json["carbohydrates"]
    ingredients = request.json["ingredients"]
    user = User.query.filter_by(id=user_id).first()
    if user:
        new_recipe = Recipe(title=title, category=category, time=time, steps=steps,
                            calories=calories, proteins=proteins, fats=fats,
                            carbohydrates=carbohydrates)
        session.add(new_recipe)
        session.commit()
        if ingredients:
            new_recipe.ingredients.extend(ingredients)
            session.commit()
    return jsonify({'status': True})


# Удалить рецепт
@app.route('/api/rem_recipes', methods=['DELETE'])
def rem_recipes():
    if not request.json:
        abort(400)
    jsonify({'status': True})


# Изменить рецепт
@app.route('/api/edit_recipes', methods=['PUT'])
def edit_recipes():
    if not request.json:
        abort(400)
    jsonify({'status': True})


# Получить рецепт
@app.route('/api/get_recipes', methods=['GET'])
def get_recipes():
    recipe = session.query(Recipe).all()
    print(session.query(Session).all())
    return jsonify({'recipe': recipe})


@app.route('/api/search', methods=['GET'])
def search():
    if request.method == 'POST':
        recipes = []
        input_string = request.form.get('search')
        input_list = input_string.split()
        for recipe in session.query(Recipe).all():
            ingredient_names = [ingredient.name for ingredient in recipe.ingredients]
            ingredient_names_lower = [name.lower() for name in ingredient_names]
            for input_word in input_list:
                input_word_lower = input_word.lower()
                for name, name_lower in zip(ingredient_names, ingredient_names_lower):
                    ratio = fuzz.ratio(input_word_lower, name_lower)
                    if ratio > 70:  # задаем порог совпадения
                        recipes.append(recipe)
                        break
        for recipe in recipes:
            print(recipe.title)
    else:
        return make_response('Nothing found')


if __name__ == '__main__':
    app.run(debug=True, port=8000)
