import random
from hashlib import sha256

from flask import Flask, jsonify, make_response, request, abort
from flask_migrate import Migrate

from data.__models import SqlBase, User, Recipe, Ingredient, associated_recipes, Sessions

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


# Получаем пользователя для отображения его страницы
@app.route("/api/get_user", methods=["GET"])
def get_user():
    if not request.json:
        abort(400)
    user_tag = request.json["tag"]
    if user_tag:
        user = session.query(User).order_by(tag=user_tag).first()
        recipes = session.query(Recipe).order_by(author=user.id).filter(access="public").first()
        return jsonify({
            "status": True,
            "name": user.name,
            "surname": user.surname,
            "recipes": recipes
        })
    return jsonify({"status": False})


# Проверка sshkey верный
@app.route("/api/correct_key", methods=["POST"])
def correct_key():
    if not request.json:
        abort(400)
    sshkey = request.json["sshkey"]
    ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
    if ses:
        return jsonify({"status": True})
    return jsonify({"status": False})


# Логин
@app.route("/api/user_login", methods=["POST", 'GET'])
def login():
    if not request.json:
        abort(400)
    email = request.json["email"]
    password = request.json["password"]
    users = session.query(User).all()
    for user in users:
        if (user.email == email or user.tag == email) and user.check_password(password):
            sshkey = sha256(f"H@S213s$-1{email}{user.hashed_password}".encode('utf-8')).hexdigest()
            ses = Sessions(user_id=user.id, sshkey=sshkey)
            session.add(ses)
            session.commit()
            return jsonify({'status': True, "sshkey": sshkey})
    return jsonify({"status": False})


# Логаут
@app.route("/api/user_logout", methods=["POST", 'GET'])
def logout():
    if not request.json:
        abort(400)
    sshkey = request.json["sshkey"]
    if sshkey:
        ses = session.query(Sessions).order_by(sshkey=sshkey).first()
        if ses:
            session.delete(ses)
            session.commit()
            return jsonify({"status": True})
    return jsonify({"status": False})


# Регистрация пользователя
@app.route('/api/user_reg', methods=['POST'])
def user_reg():
    if not request.json:
        abort(400)
    tag = request.json.get("tag")
    name = request.json.get("name")
    surname = request.json.get("surname")
    email = request.json.get("email")
    password = request.json.get("password")
    if not all([tag, name, surname, email, password]): # Проверка на пустые значения
        return jsonify({'status': False})
    user = session.query(User).filter_by(email=email).first()# Проверка есть ли пользователь в БД
    if user:
        return jsonify({'status': False})
    new_user = User(tag=tag, name=name, surname=surname, email=email)
    new_user.set_password(password)
    session.add(new_user)
    session.commit()
    return jsonify({'status': True})


# Добавить рецепт
@app.route('/api/add_recipes/', methods=['POST'])
def add_recipes():
    if not request.json:
        abort(400)
    print(request.json)
    sshkey = request.json["sshkey"]
    title = request.json["title"]
    category = request.json["category"]
    access = request.json["access"]
    time = request.json["time"]
    steps = request.json["steps"]
    calories = request.json["calories"]
    proteins = request.json["proteins"]
    fats = request.json["fats"]
    carbohydrates = request.json["carbohydrates"]
    ingredients = request.json["ingredients"]
    if sshkey:
        user_id = session.query(Sessions).filter_by(sshkey=sshkey).first()
        user = session.query(User).filter_by(id=user_id.user_id).first()
        if user:
            new_recipe = Recipe(title=title, category=category, time=time, access=access, steps=steps,
                                calories=calories, proteins=proteins, fats=fats,
                                carbohydrates=carbohydrates, author=user.tag, views=0, likes=0)
            session.add(new_recipe)
            session.commit()
            if ingredients:
                for ingredient in ingredients:
                    pass
                session.commit()
        return jsonify({'status': True})
    return jsonify({"status": False})


# Удалить рецепт
@app.route('/api/rem_recipes', methods=['DELETE'])
def rem_recipes():
    if not request.json:
        abort(400)
    return jsonify({'status': True})


# Изменить рецепт
@app.route('/api/edit_recipes', methods=['PUT'])
def edit_recipes():
    if not request.json:
        abort(400)
    return jsonify({'status': True})


# Получить рецепт
@app.route('/api/get_recipes', methods=['GET'])
def get_recipes():
    from_num = request.args.get('f') or 0
    to_num = request.args.get('t') or 10
    recipes = list(session.query(Recipe).all())[int(from_num):int(to_num)]
    recipes_dicts = []
    for recipe in recipes:
        recipes_dicts.append(recipe.as_dict())
    print(recipes_dicts)
    return jsonify({'recipe': recipes_dicts})


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
    app.run(debug=True, host="0.0.0.0", port=8000)
