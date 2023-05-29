from flask import Flask, request, abort, jsonify

from fuzzywuzzy import fuzz

import pymorphy2

import sqlalchemy
from sqlalchemy.orm import sessionmaker
from data.__models import SqlBase, User, Recipe, Ingredient, associated_recipes, Sessions
from server.core.utils.cmd2dict import challenge_command

app = Flask(__name__)
engine = sqlalchemy.create_engine('sqlite:///db/db_tset.db?check_same_thread=False', echo=False)
SqlBase.metadata.create_all(engine)
SqlBase.metadata.bind = engine
Session = sessionmaker(bind=engine)
session = Session()

chats = [
    {
        "id": 1,
        "messages": [
            { "from": "user", "text": "найди рецепт для завтрака" },
            { "from": "bot", "text": "я нашел рецепты:", "data": []},

        ]
    }
]

schema_list = [
    {"type": "рецепт", "act": ["найди", "покажи"], "ingredients": "context", "whitelist": ["для", "по", "пожалуйста", "на", "с", "и", "а", "до"], 'rang': 1},
]

morph = pymorphy2.MorphAnalyzer(lang='ru')

threshold = 60
limit = 10

@app.route('/chat', methods=["POST"])
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

    return jsonify({"answer": { "from": "bot", "text": "Конечно! Вот что я нашел:", "data": filtered_recipes }})


if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=8000)