from flask import Flask, request, abort, jsonify

import pymorphy2

import sqlalchemy
from sqlalchemy.orm import sessionmaker
from data.__models import SqlBase, User, Recipe, Ingredient, associated_recipes, Sessions
from server.core.utils.cmd2dict import challenge_command

app = Flask(__name__)
engine = sqlalchemy.create_engine('sqlite:///db/db.db?check_same_thread=False', echo=False)
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
    {"type": "рецепт", "act": ["найди", "покажи"], "ingredients": "context", "whitelist": ["для", "по", "пожалуйста", "на", "с"], 'rang': 1},
]

morph = pymorphy2.MorphAnalyzer(lang='ru')

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
        for ingredient in res['ingredients']:


    return jsonify({"answer": { "from": "bot", "text": "test" }})


if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=8000)