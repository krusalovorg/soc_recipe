import random
from hashlib import sha256

import pymorphy2
from flask import Flask, jsonify, make_response, request, abort, send_file
from flask_migrate import Migrate
from flask_cors import CORS

import base64, time, datetime
from io import BytesIO
from PIL import Image

from data.__models import SqlBase, User, Recipe, Ingredient, associated_recipes, Sessions, associated_users, Watches, \
    Commetns, associated_users_to_users

import sqlalchemy
from sqlalchemy.orm import sessionmaker
from flask_mail import Mail, Message
from fuzzywuzzy import fuzz

from server.core.utils.cmd2dict import challenge_command

app = Flask(__name__)
app.config['SECRET_KEY'] = "SECRET_VERY_SECRET_KEY"
app.config['MAIL_SERVER'] = 'smtp.mail.ru'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'mail.ru почта'  # введите свой адрес электронной почты здесь
app.config['MAIL_DEFAULT_SENDER'] = 'mail.ru почта'  # и здесь
app.config['MAIL_PASSWORD'] = '******'  # введите пароль
CORS(app)

engine = sqlalchemy.create_engine('sqlite:///db/db.db?check_same_thread=False', echo=False)
SqlBase.metadata.create_all(engine)
SqlBase.metadata.bind = engine
Session = sessionmaker(bind=engine)
session = Session()

migrate = Migrate(app, engine)
mail = Mail(app)
cods = []

morph = pymorphy2.MorphAnalyzer(lang='ru')


@app.route('/', methods=['POST', 'GET'])
def index():
    return jsonify({"status": True})


# Добавить коменты на рецепт
@app.route("/api/add_comment", methods=["POST"])
def add_comment():
    if request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    recipe_id = request.json.get("recipe_id")
    text = request.json.get("text")
    if all(sshkey, recipe_id, text):
        ses = session.query(Sessions).order_by(sshkey=sshkey).first()
        new_comment = Commetns(user_id=ses.user_id, recipe_id=recipe_id, text=text)
        session.add(new_comment)
        session.commit()
        return jsonify({"status": True})
    return jsonify({"status": False})


# Удалить комент с рецепта
@app.route("/api/rem_comment", methods=["POST"])
def rem_comment():
    if request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    comment_id = request.json.get("comment_id")
    if all(sshkey, comment_id):
        ses = session.query(Sessions).order_by(sshkey=sshkey).first()
        rem_comment = session.query(Commetns).order_by(id=comment_id, user_id=ses.user_id)
        session.delete(rem_comment)
        session.commit()
        return jsonify({"status": True})
    return jsonify({"status": False})


# Получить все коменты по id рецепта
@app.route("/api/get_comments", methods=["POST"])
def get_comments():
    if request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    recipe_id = request.json.get("recipe_id")
    if all(sshkey, recipe_id):
        ses = session.query(Sessions).order_by(sshkey=sshkey).first()
        get_comments = session.query(Commetns).order_by(recipe_id=recipe_id, user_id=ses.user_id).all()
        return jsonify({"status": True,
                        "comments": get_comments})
    return jsonify({"status": False})


# Получаем профль другого пользователя
@app.route("/api/get_user_profile", methods=["POST"])
def get_user_profile():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    user_tag = request.json.get("tag")
    if session.query(Sessions).filter_by(sshkey=sshkey).first():
        user = session.query(User).filter_by(tag=user_tag).first()
        recipes = session.query(Recipe).filter_by(author=user.id).all()
        return jsonify({
            "status": True,
            "name": user.name,
            "surname": user.surname,
            "likes": user.likes,
            'recipes': recipes
        })
    return jsonify({"status": False})


# Получаем свой профль
@app.route("/api/get_profile", methods=["POST"])
def get_profile():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
    if ses:
        user = session.query(User).filter_by(id=ses.user_id).first()
        recipes = session.query(Recipe).filter_by(author=ses.user_id).all()
        return jsonify({
            "status": True,
            "name": user.name,
            "surname": user.surname,
            "tag": user.tag,
            "email": user.email,
            "likes": user.likes,
            'recipes': recipes,
            "user_id": user.id
        })
    return jsonify({"status": False})


# Подписка на чужой профиль
@app.route("/api/sub_profile", methods=["POST"])
def sub_profile():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    user_for = request.json.get("user_for")
    if all(sshkey, user_for):
        ses = session.query(Sessions).order_by(sshkey=sshkey).first()
        if ses:  # Эта сессия валидна
            user_to_user_exist = session.query(associated_users_to_users).order_by(user_id_parent=ses.user_id,
                                                                                   user_id_child=user_for)
            if user_to_user_exist:
                return jsonify({"status": False})
            new_associated_users_to_users = associated_users_to_users(user_id_parent=ses.user_id,
                                                                      user_id_child=user_for)
            session.add(new_associated_users_to_users)
            session.commit()
            return jsonify({"status": True})
    return jsonify({"status": False})


# Отписка на чужой профиль
@app.route("/api/unssub_profile", methods=["POST"])
def unsub_profile():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    user_for = request.json.get("user_for")
    if all(sshkey, user_for):
        ses = session.query(Sessions).order_by(sshkey=sshkey).first()
        if ses:  # Эта сессия валидна
            del_associated_users_to_users = session.query(associated_users_to_users).order_by(
                user_id_parent=ses.user_id,
                user_id_child=user_for).first()
            if del_associated_users_to_users:
                session.delete(del_associated_users_to_users)
                session.commit()
                return jsonify({"status": True})
    return jsonify({"status": False})

# Изменение пароля
@app.route("/api/edit_password", methods=["POST"])
def edit_password():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    password = request.json.get("password")
    if sshkey:
        ses = session.query(Sessions).order_by(sshkey=sshkey).first()
        user = session.query(User).order_by(id=ses.user_id).first()

        if session.query(User).order_by(id=user.id).first().check_password(password):
            cods[user.id] = [random.randint(100000, 999999), datetime.datetime.now()]
            msg = Message("Subject", recipients=[user.email])
            msg.body = f"If you are trying to change the password copy it {cods[user.id][0]}, then this message is the place to be."
            mail.send(msg)
            return jsonify({"status": True,
                            "key": cods[user.id][0]
                            })
    return jsonify({"status": False})


# Забыли пароль
@app.route("/api/edit_password", methods=["POST"])
def remember_password():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    email = request.json.get("email")
    if sshkey:
        ses = session.query(Sessions).order_by(sshkey=sshkey).first()
        user = session.query(User).order_by(id=ses.user_id).first()

        if user.email == email:
            cods[user.id] = [random.randint(100000, 999999), datetime.datetime.now()]
            msg = Message("Subject", recipients=[user.email])
            msg.body = f"If you are trying to remember the password copy it {cods[user.id][0]}, then this message is the place to be."
            mail.send(msg)
            return jsonify({"status": True,
                            "key": cods[user.id][0]
                            })
    return jsonify({"status": False})


# Изменение пароля подтверждение
@app.route("/api/edit_password_confirm", methods=["POST"])
def edit_password_confirm():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    code = request.json.get("code")
    new_password = request.json.get("new_password")
    if sshkey:
        ses = session.query(Sessions).order_by(sshkey=sshkey).first()
        user = session.query(User).order_by(id=ses.user_id).first()
        if cods[user.id][0] == code:
            if ((datetime.datetime().now() - cods[user.id][1]).minute < 3):
                user.set_password(new_password)
                sshkey = sha256(f"H@S213s$-1{user.email}{user.hashed_password}".encode('utf-8')).hexdigest()
                ses.sshkey = sshkey
                session.commit()
            return jsonify({"status": True, "sshkey": sshkey})
    return jsonify({"status": False})


@app.route("/api/add_like", methods=["POST"])
def add_like():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    recipe_id = request.json.get("recipe_id")
    if sshkey and recipe_id:
        ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
        user = session.query(User).filter_by(id=ses.id).first()
        if user:
            recipe = session.query(Recipe).filter_by(id=recipe_id).first()
            likes = recipe.likes
            if isinstance(likes, str):
                likes = likes.split('|')
            if str(user.id) in likes:
                likes.remove(str(user.id))
            else:
                likes.append(str(user.id))
            recipe.likes = '|'.join(likes)
            session.commit()
            return jsonify({"status": True})
    return jsonify({"status": False})


@app.route("/api/get_like", methods=["GET"])
def get_like():
    if not request.json:
        abort(400)
    recipe_id = request.json.get("recipe_id")
    if recipe_id:
        recipes = session.query(Commetns).order_by(recipe_id=recipe_id).all()
        return jsonify({"status": True, "recipes": recipes})
    return jsonify({"status": False})


# Просмотры на рецпете
@app.route("/api/add_watch", methods=["POST"])
def add_watch():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    recipe_id = request.json.get("recipe_id")
    if sshkey and recipe_id:
        ses = session.query(Sessions).order_by(sshkey=sshkey).first()
        wathes = session.query(Watches).order_by(user_id=ses.user_id).first()
        if wathes:
            session.delete(wathes)
            session.commit()
            return jsonify({"status": True})
        session.add(Watches(user_id=ses.id, recipe_id=recipe_id))
        session.commit()
        return jsonify({"status": True})
    return jsonify({"status": False})


@app.route("/api/get_watch", methods=["GET"])
def get_watch():
    if not request.json:
        abort(400)
    recipe_id = request.json.get("recipe_id")
    if recipe_id:
        watch = session.query(Watches).order_by(recipe_id=recipe_id).all()
        return jsonify({"status": True, "watch": watch})
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
    user_found = False
    for user in users:
        if (user.email == email or user.tag == email) and user.check_password(password):
            sshkey = sha256(f"H@S213s$-1{email}{user.hashed_password}".encode('utf-8')).hexdigest()
            ses = Sessions(user_id=user.id, sshkey=sshkey)
            session.add(ses)
            session.commit()
            user_found = True
            return jsonify({'status': True, "sshkey": sshkey})

    if user_found:
        return jsonify({"status": False, "error": "password"})
    else:
        return jsonify({"status": False, "error": "user"})


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
    if not all([tag, name, surname, email, password]):  # Проверка на пустые значения
        return jsonify({'status': False})
    user = session.query(User).filter_by(email=email).first()  # Проверка есть ли пользователь в БД
    if user:
        return jsonify({'status': False})
    new_user = User(tag=tag, name=name, surname=surname, email=email)
    new_user.set_password(password)
    session.add(new_user)
    session.commit()
    return jsonify({'status': True})


# Получить изображение с сервера
@app.route('/api/get_image/<string:filename>', methods=['GET'])
def get_image(filename):
    return send_file('./images/' + filename)


# Добавить рецепт
@app.route('/api/add_recipes/', methods=['POST'])
def add_recipes():
    print(request.json)
    if not request.json:
        abort(400)
    sshkey = request.json["sshkey"]
    title = request.json["title"]
    category = request.json["category"]
    access = request.json["access"]
    time_ = request.json["time"]
    steps = request.json["steps"]
    calories = request.json["calories"]
    proteins = request.json["proteins"]
    fats = request.json["fats"]
    carbohydrates = request.json["carbohydrates"]
    ingredients = request.json["ingredients"]
    image = request.json.get('file')
    filename = request.json.get('filename')
    description = request.json["description"]

    if sshkey:
        user_id = session.query(Sessions).filter_by(sshkey=sshkey).first()
        user = session.query(User).filter_by(id=user_id.user_id).first()
        if user:
            crypto_name_file = sha256((filename + str(time.time())).encode("utf-8")).hexdigest() + "." + \
                               filename.split(".")[1]
            new_recipe = Recipe(title=title, category=category, time=time_, access=access, steps=steps,
                                calories=calories, proteins=proteins, fats=fats, description=description,
                                carbohydrates=carbohydrates, ingredients=ingredients, author=user.tag,
                                image=crypto_name_file, views=0, likes="")

            starter = image.find(',')
            image_data = image[starter + 1:]
            image_data = bytes(image_data, encoding="ascii")
            im = Image.open(BytesIO(base64.b64decode(image_data)))
            im.save(f'./images/{crypto_name_file}')

            session.add(new_recipe)
            session.commit()
        return jsonify({'status': True})
    return jsonify({"status": False})


# Удалить рецепт
@app.route('/api/rem_recipes', methods=['DELETE'])
def rem_recipes():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    id_ = request.json.get("id_")
    if sshkey == session.query(Session).order_by(sshkey=sshkey).first():
        session.delete(Recipe(id=id_))
        return jsonify({'status': True})
    return jsonify({'status': False})


# Изменить рецепт
@app.route('/api/edit_recipes', methods=['PUT'])
def edit_recipes():
    if not request.json:
        abort(400)
    id_ = request.json.get("id")
    sshkey = request.json.get("sshkey")
    title = request.json.get("title")
    category = request.json.get("category")
    access = request.json.get("access")
    time_ = request.json.get("time")
    steps = request.json.get("steps")
    calories = request.json.get("calories")
    proteins = request.json.get("proteins")
    fats = request.json.get("fats")
    carbohydrates = request.json.get("carbohydrates")
    ingredients = request.json.get("ingredients")
    image = request.json.get.get('file')
    filename = request.json.get('filename')
    description = request.json.get("description")

    if sshkey:
        user_id = session.query(Sessions).filter_by(sshkey=sshkey).first()
        user = session.query(User).filter_by(id=user_id.user_id).first()
        recipe = session.query(Recipe).order_by(id=id_).first()
        if user:
            crypto_name_file = sha256((filename + str(time.time())).encode("utf-8")).hexdigest() + "." + \
                               filename.split(".")[1]
            recipe.title = title
            recipe.category = category
            recipe.time = time_
            recipe.access = access
            recipe.steps = steps
            recipe.calories = calories
            recipe.proteins = proteins
            recipe.fats = fats
            recipe.description = description
            recipe.carbohydrates = carbohydrates
            recipe.ingredients = ingredients
            recipe.author = user.tag
            recipe.image = crypto_name_file

            starter = image.find(',')
            image_data = image[starter + 1:]
            image_data = bytes(image_data, encoding="ascii")
            im = Image.open(BytesIO(base64.b64decode(image_data)))
            im.save(f'./images/{crypto_name_file}')

            session.commit()
        return jsonify({'status': True})
    return jsonify({"status": False})


# Получить рецепты
@app.route('/api/get_recipes', methods=['GET'])
def get_recipes():
    from_num = request.args.get('f') or 0
    to_num = request.args.get('t') or 10
    recipes = list(session.query(Recipe).all())[int(from_num):int(to_num)]
    recipes_dicts = []
    for recipe in recipes:
        recipes_dicts.append(recipe.as_dict())
    return jsonify({'recipe': recipes_dicts})


# Получить рецепт
@app.route('/api/get_recipe', methods=['GET'])
def get_recipe():
    id_ = request.args.get('id') or 0
    recipe = session.query(Recipe).filter_by(id=id_).first()
    recipe.views += 1
    session.commit()
    return jsonify({'recipe': recipe.as_dict()})


@app.route('/api/search', methods=['POST'])
def search():
    if request.method == 'POST':
        input_string = request.json.get('search')
        return jsonify({"recipes": []})
    else:
        return make_response('Nothing found')


# krusalovorg

chats = [
    {
        "id": 1,
        "messages": [
            {"from": "user", "text": "найди рецепт для завтрака"},
            {"from": "bot", "text": "я нашел рецепты:", "data": []},

        ]
    }
]

schema_list = [
    {"type": "рецепт", "act": ["найди", "покажи"], "ingredients": "context",
     "whitelist": ["для", "по", "пожалуйста", "на", "с", "и", "а", "до"], 'rang': 1},
]

threshold = 60
limit = 10


@app.route('/api/chat', methods=["POST"])
def chatting():
    if not request.json:
        abort(400)

    sshkey = request.json.get("sshkey")
    text = request.json.get("text")

    session_ = session.query(Sessions).filter_by(sshkey=sshkey).first()
    if not session_:
        print('not session')
        abort(400)

    user_id = session_.user_id

    model = {"from": user_id, "text": text}

    res = challenge_command(text, schema_list)

    if res:
        input_ingredients = []
        for ingredient in res['ingredients']:
            word = morph.parse(ingredient)[0].normal_form
            input_ingredients.append(word)

    filtered_recipes = []

    recipes = session.query(Recipe).all()

    for recipe in recipes:
        recipe_ingredients = recipe.ingredients
        match_scores = []
        for ingredient in input_ingredients:
            best_match = 0
            for recipe_ingredient in recipe_ingredients:
                match_score = fuzz.token_set_ratio(ingredient.lower(), recipe_ingredient['name'].lower())
                if match_score > best_match:
                    best_match = match_score
            match_scores.append(best_match)
        avg_score = sum(match_scores) / len(match_scores)
        if avg_score >= threshold:
            filtered_recipes.append((recipe.as_dict(), avg_score))

    filtered_recipes.sort(key=lambda x: x[1], reverse=True)

    return jsonify({"answer": {"from": "bot", "text": "Конечно! Вот что я нашел:", "data": filtered_recipes}})


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8000)
