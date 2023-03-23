import difflib
import random, re
from hashlib import sha256

import pymorphy2
from flask import Flask, jsonify, request, abort, send_file
from flask_migrate import Migrate
from flask_cors import CORS

import base64, time, datetime
from io import BytesIO
from PIL import Image

from data.__models import SqlBase, User, Recipe, Sessions, \
    Commetns, Subscriptions, DM, Category, Messages, Chats, associated_users

import sqlalchemy
from sqlalchemy.orm import sessionmaker
from flask_mail import Mail
from fuzzywuzzy import fuzz

from server.core.utils.cmd2dict import challenge_command, parse_command

import enchant

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
cods = {"2": [60104, datetime.datetime.now()]}

morph = pymorphy2.MorphAnalyzer(lang='ru')
dictionary = enchant.Dict("en_EN")


@app.route('/', methods=['POST', 'GET'])
def index():
    return jsonify({"status": True})


# Получить все категории
@app.route("/api/get_categories")
def get_categories():
    if not request.json:
        abort(400)
    categories = session.query(Category).all()
    return jsonify({"status": True, "categories": categories})


# Добавить коменты на рецепт
@app.route("/api/add_comment", methods=["POST"])
def add_comment():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    recipe_id = request.json.get("recipe_id")
    text = request.json.get("text")
    ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
    if text and ses and recipe_id:
        user = session.query(User).filter_by(id=ses.user_id).first()
        new_comment = Commetns(user_id=ses.user_id, recipe_id=recipe_id, text=text, name=user.name,
                               surname=user.surname)
        session.add(new_comment)
        session.commit()
        return jsonify({"status": True})
    return jsonify({"status": False})


# Удалить комент с рецепта
@app.route("/api/rem_comment", methods=["POST"])
def rem_comment():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    comment_id = request.json.get("comment_id")
    if all(sshkey, comment_id):
        ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
        rem_comment = session.query(Commetns).filter_by(id=comment_id, user_id=ses.user_id)
        session.delete(rem_comment)
        session.commit()
        return jsonify({"status": True})
    return jsonify({"status": False})


# Добавление сообщения в лс
def add_chat_message(sshkey, user_sender_tag, user_recipient_id, text):
    ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
    user = session.query(User).filter_by(id=ses.user_id).first()
    if user.tag == user_sender_tag:
        new_DM = DM(user_sender_id=user.id, user_recipient_id=user_recipient_id, text=text)
        session.add(new_DM)
        session.commit()
        messages = session.query(DM).filter_by(user_recipient_id=user_recipient_id, user_sender_id=user.id).all()
        send_message = []
        for message in messages:
            send_message.append(message)
        return {"status": True, "messages": send_message}
    return {"status": False}


# Получени истори сообщений в лс
def get_chat_messages(sshkey, user_sender_tag, user_recipient_id):
    ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
    user = session.query(User).filter_by(id=ses.user_id).first()
    if user.tag == user_sender_tag:
        messages = session.query(DM).filter_by(user_recipient_id=user_recipient_id, user_sender_id=user.id).all()
        send_message = []
        for message in messages:
            send_message.append(message)
        return {"status": True, "messages": send_message}
    return {"status": False}


# Получить все коменты по id рецепта
@app.route("/api/get_comments", methods=["POST"])
def get_comments():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    recipe_id = request.json.get("recipe_id")
    if all(sshkey, recipe_id):
        ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
        get_comments = session.query(Commetns).filter_by(recipe_id=recipe_id, user_id=ses.user_id).all()
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
        recipes = session.query(Recipe).filter_by(author=user.tag).all()
        recipes_array = []

        for recipe in recipes:
            recipes_array.append(recipe.as_dict())

        print(recipes_array)

        subs = get_subs(user.id)

        print("SUBS", subs)

        return jsonify({
            "status": True,
            "name": user.name,
            "surname": user.surname,
            "likes": user.likes,
            'recipes': recipes_array,
            "subscriptions": subs,
            "id": user.id
        })
    return jsonify({"status": False})


def get_subs(user_id: int) -> list:
    subscriptions_users_id = session.query(Subscriptions).filter_by(user_id_parent=user_id).all()
    subscriptions = []  # Нужно переписать это не оптимизированый for
    for sub in subscriptions_users_id:
        print('get_id', sub.user_id_child)
        sub_user = session.query(User).filter_by(id=sub.user_id_child).first()
        if sub_user:
            sub_user = sub_user.as_dict()
            del sub_user['email']
            del sub_user['hashed_password']
            del sub_user['admin']
            subscriptions.append(sub_user)
    return subscriptions


# Получаем свой профль
@app.route("/api/get_profile", methods=["POST"])
def get_profile():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
    if ses:
        user = session.query(User).filter_by(id=ses.user_id).first()
        recipes = session.query(Recipe).filter_by(author=user.tag).all()

        new_recipes = []
        for recipe in recipes:
            new_recipes.append(recipe.as_dict())

        subs = get_subs(user.id)
        return jsonify({
            "status": True,
            "name": user.name,
            "surname": user.surname,
            "tag": user.tag,
            "email": user.email,
            "likes": len(user.likes),
            'recipes': new_recipes,
            "user_id": user.id,
            "subscriptions": subs,
            "admin": user.admin
        })
    return jsonify({"status": False})


# Подписка на чужой профиль
@app.route("/api/sub_profile", methods=["POST"])
def sub_profile():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    user_for = request.json.get("user_for")
    if sshkey and user_for:
        print("ASDOASOPIDJKASOPDJKASOPDAJSOPDJASD")
        ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
        if ses:  # Эта сессия валидна
            user = session.query(User).filter_by(id=ses.user_id).first()
            print('sub', user.tag, user_for)
            user_to_user_exist = session.query(Subscriptions).filter_by(user_id_parent=user.id,
                                                                        user_id_child=user_for).first()
            print('isjdasiojdioasjdoiajdois', user_to_user_exist)
            if user_to_user_exist:
                return jsonify({"status": False})
            user__for = Subscriptions(user_id_parent=ses.user_id, user_id_child=user_for)
            session.add(user__for)
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
    if sshkey and user_for:
        ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
        if ses:  # Эта сессия валидна
            user = session.query(User).filter_by(id=ses.user_id).first()
            del_subscriptions = session.query(Subscriptions).filter_by(
                user_id_parent=user.id,
                user_id_child=user_for).first()
            print('unsub', del_subscriptions)
            if del_subscriptions:
                session.delete(del_subscriptions)
                session.commit()
                return jsonify({"status": True})
    return jsonify({"status": False})


# Изменение аватара профиля
@app.route("/api/edit_profile/avatar/add", methods=["POST"])
def edit_profile_avatar():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    image = request.json.get("image")
    if all(sshkey, image):
        ses = session.query(Sessions).filter_by(sshkey=sshkey)
        user = session.query(User).filter_by(id=ses.user_id)
        image_hash_name = sha256(image + str(user.id)).hexdigest() + "."
        user.avatar = f"./images/{user.id}/{image_hash_name}"

        starter = image.find(',')
        image_data = image[starter + 1:]
        image_data = bytes(image_data, encoding="ascii")
        im = Image.open(BytesIO(base64.b64decode(image_data)))
        im.save(f'./images/{user.id}/{image_hash_name}')
        session.commit()
        return jsonify({"status": True})
    return jsonify({"status": False})


# Получить аватар пользователя
@app.route("/api/get_user_avatar", methods=["GET"])
def get_user_avatar():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    if sshkey:
        ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
        user = session.query(User).filter_by(id=ses.user_id)
        return send_file(user.avatar)
    return jsonify({"status": False})


# Забыли пароль
@app.route("/api/edit_password", methods=["POST"])
def remember_password():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    email = request.json.get("email")
    if sshkey:
        ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
        user = session.query(User).filter_by(id=ses.user_id).first()
        if user.email == email:
            cods[str(user.id)] = [random.randint(10000, 99999), datetime.datetime.now()]
            """
            msg = Message("Cookhub", recipients=[user.email])
            msg.body = f"Код для сброса пароля: {cods[str(user.id)][0]}, никому не говорите этот код."
            mail.send(msg)
            """
            return jsonify({"status": True,
                            "key": cods[str(user.id)][0]
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
        ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
        user = session.query(User).filter_by(id=ses.user_id).first()

        if cods[str(user.id)][0] == int(code):
            if ((datetime.datetime.now()) - cods[str(user.id)][1]).seconds < 180:
                user.set_password(new_password)
                sshkey = sha256(f"H@S213s$-1{user.email}{user.hashed_password}".encode('utf-8')).hexdigest()
                ses.sshkey = sshkey
                session.commit()
            return jsonify({"status": True, "sshkey": sshkey})
    return jsonify({"status": False})


# Лайк на рецепт удаление/добавление
@app.route("/api/add_like", methods=["POST"])
def add_like():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    recipe_id = request.json.get("recipe_id")
    if all([sshkey, recipe_id]):
        ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
        user = session.query(User).filter_by(id=ses.id).first()
        if user:  # проверка что сесия валидна
            recipe = session.query(Recipe).filter_by(id=recipe_id).first()
            like = session.query(associated_users).filter_by(user_id=user.id, recipe_id=recipe_id).first()
            if like:
                session.delete(like)
            else:
                new_like = associated_users.insert().values(user_id=user.id, recipe_id=recipe_id)
                session.execute(new_like)
            session.commit()
            return jsonify({"status": True})
    return jsonify({"status": False})


@app.route("/api/get_like", methods=["GET"])
def get_like():
    if not request.json:
        abort(400)
    recipe_id = request.json.get("recipe_id")
    if recipe_id:
        recipes = session.query(Commetns).filter_by(recipe_id=recipe_id).all()
        return jsonify({"status": True, "recipes": recipes})
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
        ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
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
    tag = request.json.get("tag").strip()
    name = request.json.get("name").strip()
    surname = request.json.get("surname").strip()
    email = request.json.get("email").strip()
    password = request.json.get("password").strip()
    if not all([tag, name, surname, email, password]):  # Проверка на пустые значения
        return jsonify({'status': False})
    user = session.query(User).filter_by(email=email).first()  # Проверка есть ли пользователь в БД
    if user:
        return jsonify({'status': False})
    new_user = User(tag=tag, name=name, surname=surname, email=email)
    if tag == "krusalovorg":
        new_user.admin = True

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
        ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
        if ses:
            user = session.query(User).filter_by(id=ses.user_id).first()
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
    ses = session.query(Session).filter_by(sshkey=sshkey).first()
    if ses:
        user = session.query(User).filter_by(id=ses.user_id).first()
        if user.admin:
            session.delete(Recipe(id=id_))
            return jsonify({'status': True})
        recipe = session.query(Recipe).filter_by(id=id_).first()
        if user.tag == recipe.author:
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
    changes = request.json.get["changes"]
    if sshkey:
        user_id = session.query(Sessions).filter_by(sshkey=sshkey).first()
        user = session.query(User).filter_by(id=user_id.user_id).first()
        recipe = session.query(Recipe).filter_by(id=id_).first()
        if user:
            for change in changes:
                recipe[change["column"]] = change["value"]
            session.commit()
            return jsonify({'status': True})
    return jsonify({"status": False})


# Изменить рецепт фото
@app.route('/api/edit_recipes_image', methods=['PUT'])
def edit_recipes_image():
    if not request.json:
        abort(400)
    id_ = request.json.get("id")
    sshkey = request.json.get("sshkey")
    filename = request.json.get("filename")
    image = request.json.get("image")
    if sshkey:
        user_id = session.query(Sessions).filter_by(sshkey=sshkey).first()
        user = session.query(User).filter_by(id=user_id.user_id).first()
        recipe = session.query(Recipe).filter_by(id=id_).first()
        if user:
            crypto_name_file = sha256((filename + str(time.time())).encode("utf-8")).hexdigest() + "." + \
                               filename.split(".")[1]
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
    callbacck = []
    for recipe in recipes:
        recipe = recipe.as_dict()
        likes = session.query(associated_users).filter_by(recipe_id=recipe.id).all()
        comments = session.query(Commetns).filter_by(recipe_id=recipe.id).all()
        callbacck.append({"recipe": recipe, "likes": len(likes), "comments": len(comments)})
    return jsonify({"status": True, 'recipe': callbacck})


# Получить рецепт
@app.route('/api/get_recipe', methods=['GET'])
def get_recipe():
    id_ = request.args.get('id') or 0
    recipe = session.query(Recipe).filter_by(id=id_).first()

    if recipe:
        comments = session.query(Commetns).filter_by(recipe_id=id_).all()
        new_comments = []
        for comment in comments:
            new_comments.append(comment.as_dict())

        recipe.views += 1
        session.commit()
        recipe_json = recipe.as_dict()
        recipe_json['comments'] = new_comments

        return jsonify({'status': True, 'recipe': recipe_json})
    return jsonify({'status': False})


# получение рекомендаций
@app.route("/api/get_recomendations", methods=["POST"])
def get_recommendations():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    ses = session.query(Sessions).filter_by(sshkey=sshkey).first()
    if ses:
        subscriptions = session.query(Subscriptions).filter_by(user_id_child=ses.user_id).limit(20).all()
        frend_arr = []
        if len(subscriptions) > 0:
            for sub in subscriptions:
                recipes = session.query(Recipe).filter_by(author_id=sub.user_id_child)
                recipes = recipes.limit(3).all()
                for recipe in recipes:
                    like = session.query(associated_users).filter_by(recipe_id=recipe.id).count()
                    com = session.query(Commetns).filter_by(recipe_id=recipe.id).count()
                    frend_arr.append({"recipe": recipe.as_dict(), "like": like, "com": com})
        recomendations = session.query(Recipe)
        recomendations = recomendations.order_by(sqlalchemy.desc(Recipe.views)).limit(3).all()
        rec_dicts_new = [] + frend_arr

        for recipe in recomendations:
            if recipe not in rec_dicts_new:
                like = session.query(associated_users).filter_by(recipe_id=recipe.id).count()
                com = session.query(Commetns).filter_by(recipe_id=recipe.id).count()
                rec_dicts_new.append({"recipe": recipe.as_dict(), "like": like, "com": com})

        return jsonify({"status": True, "recipes": rec_dicts_new})
    return jsonify({"status": False, "recipes": []})


# Что приготовить
@app.route("/api/what_to_cook", methods=["GET"])
def what_to_cook():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    catgr = request.json.get("catgr")
    ses = session.query(Sessions).filter_by(sshkey=sshkey)
    if ses:  # Session valid
        return_recipes = []
        if catgr:  # Empty categories
            recipes = session.query(Recipe).filter_by(category=catgr).all()
        else:
            recipes = session.query(Recipe).all()
        for recipe in recipes.index(random.sample(recipes, 4)):
            return_recipes.append(recipe)
        return jsonify({"status": True,
                        "recipes": return_recipes})
    return jsonify({"status": False,
                    "err": "User session not found"})


def search_all(search_text=None, filter_text=None, categories=None, only_categories=True):
    pattern = '%' + '%'.join(search_text.split(" ")) + '%'

    if filter_text:
        recipes = session.query(Recipe).filter(sqlalchemy.or_(Recipe.title.like(pattern),
                                                              Recipe.steps.like(pattern),
                                                              Recipe.ingredients.like(pattern),
                                                              Recipe.description.like(pattern),
                                                              User.tag(pattern),
                                                              ).and_(
            *(getattr(Recipe, filt["column"]).between(filt["value1"], filt["value2"]) for filt in filter_text))).all()
    elif categories:
        if only_categories:
            # recipes = session.query(Recipe).filter(sqlalchemy.or_(
            #     *[getattr(Category, category.lower(), None) for category in categories if
            #       hasattr(Category, category.lower())])).all()
            recipes = session.query(Recipe).filter_by(category=categories[0]).all()
        else:
            recipes = session.query(Recipe).filter(sqlalchemy.or_(Recipe.title.like(pattern),
                                                                  Recipe.steps.like(pattern),
                                                                  Recipe.ingredients.like(pattern),
                                                                  Recipe.description.like(pattern)).and_(
                *[getattr(Category, category.lower(), None) for category in categories if
                  hasattr(Category, category.lower())])).all()
    else:
        recipes = session.query(Recipe).filter(sqlalchemy.or_(Recipe.title.like(pattern),
                                                              Recipe.steps.like(pattern),
                                                              Recipe.ingredients.like(pattern),
                                                              Recipe.description.like(pattern), )).all()
    recipes_array = [recipe.as_dict() for recipe in recipes]
    print(recipes)

    return recipes_array


@app.route('/api/search', methods=['POST'])
def search():
    search_text = request.json.get('search_text')
    filter_text = request.json.get("filter")
    categories = request.json.get("categories")
    only_categories = request.json.get("only_categories") or False

    """
        new_words = dict()
        suggestions = set(dictionary.suggest(search_text))
        print(suggestions, search_text)
        for word in suggestions:
            measure = difflib.SequenceMatcher(None, search_text, word).ratio()
            new_words[measure] = word
        print(new_words)
        search_text = new_words[max(new_words.keys())]
    """
    pattern = '%' + '%'.join(search_text.split(" ")) + '%'

    users_array = []
    if len(search_text) > 1:
        users = session.query(User).filter(sqlalchemy.or_(User.tag.like(pattern),
                                                          User.name.like(pattern),
                                                          User.surname.like(pattern)))
        for user in users:
            user = user.as_dict()
            del user['email']
            del user['hashed_password']
            del user['admin']
            users_array.append(user)

    recipes_array = search_all(search_text, filter_text, categories, only_categories)

    return jsonify({"recipes": recipes_array, 'users': users_array})


@app.route("/api/create_message", methods=["POST"])
def create_message():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    text = request.json.get("text")
    chat_id = request.json.get("chat_id")
    user_id = session.query(Sessions).order_by(sshkey=sshkey).first()
    if user_id:
        new_message = Messages(chat=chat_id, author=user_id, text=text)
        session.add(new_message)
        session.commit()
        return jsonify({"status": True})
    return jsonify({"status": False, "err": "User not found"})


@app.route("/api/delete_message", methods=["POST"])
def delete_message():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    message_id = request.json.get("message_id")
    user_id = session.query(Sessions).filter_by(sshkey=sshkey).first()
    message = session.query(Messages).filter_by(id=message_id)
    if user_id == message.author:
        session.delete(message)
        session.commit()
        return jsonify({"status": True})
    return jsonify({"status": False})


@app.route("/api/edit_message", methods=["POST"])
def edit_message():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    message_id = request.json.get("message_id")
    text = request.json.get("text")
    user_id = session.query(Sessions).filter_by(sshkey=sshkey).first()
    if user_id:
        message = session.query(Messages).filter_by(message_id=message_id).first()
        message.text = text
        session.commit()
        return jsonify({"status": True})
    return jsonify({"status": False, "err": "User not found"})


@app.route("/api/get_messages", methods=["GET"])
def get_messages():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    chat_id = request.json.get("chat_id")
    user_id = session.query(Sessions).filter_by(shhkey=sshkey)
    if user_id:
        messages = session.query(Messages).filter_by(chat_id=chat_id).all()[:30]
        return jsonify({"status": True, "messages": messages})
    return ({"status": False, "err": "User not found"})


@app.route("/api/get_chats_list", methods=["GET"])
def get_chats_list():
    if not request.json:
        abort(400)
    sshkey = request.json.get("sshkey")
    user_id = session.query(Sessions).filter_by(shhkey=sshkey)
    if user_id:
        extend_chats = []
        chats = session.query(Chats).filter_by(sqlalchemy.or_(Chats.user1 == user_id, Chats.user2 == user_id)).all()
        for chat in chats:
            if chat.user1 == user_id:
                user_obj = session.query(User).filter_by(id=chat.user2).first()
            else:
                user_obj = session.query(User).filter_by(id=chat.user1).first()
            message = session.query(Messages).filter_by(chat=chat.id).order_by(sqlalchemy.desc(session.date)).all()[-1]
            last_message = {"text": message.text, "date": message.date}
            user = {"avatar": user_obj.avatar, "name": user_obj.name}
            extend_chats.append([last_message, user])
        return jsonify({"status": True, "extend_chats": extend_chats})
    return jsonify({"status": False, "err": "User not found"})


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
     "whitelist": ["для", "по", "пожалуйста", "на", "с", "и", "а", "до", "привет", "использованием"], 'rang': 1}
]

context = {}

threshold = 60
limit = 10


def searching(ingredients):
    input_ingredients = []
    for ingredient in ingredients:
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
    recipes_new = [recipe_dict for recipe_dict, score in filtered_recipes]
    return recipes_new


def send_recipes(recipes):
    return jsonify({"answer": {"from": "bot",
                               "text": "Вот несколько рецептов, которые вы можете приготовить из этих ингредиентов:",
                               "data": recipes}})


@app.route('/api/chat', methods=["POST"])
def chatting():
    def clear():
        context[user_id] = {"step": "add",
                            "ingredients": this_context.get("ingredients", []) if this_context else []}
        return jsonify({"answer": {"from": "bot",
                                   "text": "К сожалению, я не смог найти рецепты по указанным ингредиентам. Хотели бы вы добавить еще ингредиентов?"}})

    if not request.json:
        abort(400)

    sshkey = request.json.get("sshkey")
    text = request.json.get("text")

    session_ = session.query(Sessions).filter_by(sshkey=sshkey).first()
    if not session_:
        abort(400)

    user_id = session_.user_id
    this_context = context.get(user_id)

    res = challenge_command(text.lower().strip(), schema_list)

    clear_text = re.sub("[^аА-яЯ ]", "", text.lower().strip())

    if res:
        if res.get("type") == 'рецепт':
            if res.get("ingredients")[0] == "салат":
                return jsonify({"answer": {"from": "bot",
                                           "text": "Для того, чтобы мне было проще найти салат, пожалуйста, сообщите мне его название или список ингредиентов."}})
            recipes = searching(res.get("ingredients"))
            if recipes:
                return send_recipes(recipes)
            else:
                recipes_array = []
                ingr_str = ""
                for ingr in res.get("ingredients", []):
                    ingr_str += morph.parse(ingr)[0].normal_form + " "
                recipes_array += search_all(ingr_str, False, False, False)
                if recipes_array:
                    return send_recipes(recipes_array)
                else:
                    return clear()
    elif this_context and this_context.get("step") == "add":
        context[user_id]['step'] = "add2"
        return jsonify({"answer": {"from": "bot",
                                   "text": "Хорошо, перечислите их."}})
    elif this_context and this_context.get("step") == "add2":
        context[user_id] = {"step": "add",
                            "ingredients": [*this_context.get("ingredients", []), *clear_text.split(" ")]}
        recipes_array = search_all(clear_text, None, None, False)
        if recipes_array:
            return send_recipes(recipes_array)
        else:
            return clear()

    else:
        return clear()

    return jsonify({"answer": {"from": "bot", "text": "Попросите меня найти рецепт, я пришлю его прямо сюда!"}})


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8000)
