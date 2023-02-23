import sys

from flask import Flask, flash, render_template, url_for, request, redirect, abort
from flask_migrate import Migrate

from data.__models import SqlBase

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


@app.route('/add_recipes', methods=['post', 'get'])
def add_recipes():
    return


@app.route('/rem_recipes', methods=['post', 'get'])
def rem_recipes():
    return


@app.route('/edit_recipes', methods=['post', 'get'])
def edit_recipes():
    return


@app.route('/get_recipes', methods=['post', 'get'])
def get_recipes():
    return


if __name__ == '__main__':
    app.run(debug=True, port=8000)
