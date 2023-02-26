import sqlalchemy

from sqlalchemy import orm
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_serializer import SerializerMixin

from flask_login import UserMixin

from werkzeug.security import check_password_hash, generate_password_hash

import datetime

SqlBase = declarative_base()


class Recipe(SqlBase):
    __tablename__ = 'recipes'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    title = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    category = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('categories.id'))
    time = sqlalchemy.Column(sqlalchemy.Integer, nullable=False)
    access = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    steps = sqlalchemy.Column(sqlalchemy.JSON, nullable=False)
    calories = sqlalchemy.Column(sqlalchemy.Integer)
    proteins = sqlalchemy.Column(sqlalchemy.Integer)
    fats = sqlalchemy.Column(sqlalchemy.Integer)
    carbohydrates = sqlalchemy.Column(sqlalchemy.Integer)
    author = sqlalchemy.Column(sqlalchemy.String, sqlalchemy.ForeignKey('users.tag'))
    views = sqlalchemy.Column(sqlalchemy.Integer)
    likes = sqlalchemy.Column(sqlalchemy.Integer)
    image = sqlalchemy.Column(sqlalchemy.String)
    ingredients = sqlalchemy.Column(sqlalchemy.JSON)
    description = sqlalchemy.Column(sqlalchemy.String)

    user_access = orm.relationship('User', secondary='recipes_access_to_users', backref='recipes')

    # ingredients = orm.relationship('Ingredient', secondary='ingredients_to_recipes', backref='recipes')
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Category(SqlBase):
    __tablename__ = 'categories'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    title = sqlalchemy.Column(sqlalchemy.String, nullable=False)


class Ingredient(SqlBase):
    __tablename__ = 'ingredients'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    title = sqlalchemy.Column(sqlalchemy.String, nullable=False)

    def __repr__(self):
        return f'<Ingredient> {self.id}'


class User(SqlBase, UserMixin, SerializerMixin):
    __tablename__ = 'users'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    tag = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    surname = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    email = sqlalchemy.Column(sqlalchemy.String, index=True, unique=True, nullable=False)
    hashed_password = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    created_date = sqlalchemy.Column(sqlalchemy.DateTime, default=datetime.datetime.now)

    likes = orm.relationship('Recipe', secondary='recipes_to_users', backref='users')

    def __repr__(self):
        return f'<User> {self.id} {self.surname} {self.name}'

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)


class Sessions(SqlBase):
    __tablename__ = "sessions"

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    user_id = sqlalchemy.Column(sqlalchemy.Integer, nullable=False)
    sshkey = sqlalchemy.Column(sqlalchemy.String, nullable=False)


class Article(SqlBase):
    __tablename__ = "articles"

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    text = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    author = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'))


class Watches(SqlBase):
    __tablename__ = "watchers"

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    user_id = sqlalchemy.Column(sqlalchemy.String, sqlalchemy.ForeignKey('users.id'))
    recipe_id = sqlalchemy.Column(sqlalchemy.String, sqlalchemy.ForeignKey('recipes.id'))


class Commetns(SqlBase):
    __tablename__ = "Comments"

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    user_id = sqlalchemy.Column(sqlalchemy.String, sqlalchemy.ForeignKey('users.id'))
    recipe_id = sqlalchemy.Column(sqlalchemy.String, sqlalchemy.ForeignKey('recipes.id'))
    title = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    text = sqlalchemy.Column(sqlalchemy.String, nullable=False)


associated_access = sqlalchemy.Table(
    'recipes_access_to_users', SqlBase.metadata,
    sqlalchemy.Column("recipe_id", sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('recipes.id')),
    sqlalchemy.Column('user_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('users.id'))
)

associated_recipes = sqlalchemy.Table(
    'ingredients_to_recipes', SqlBase.metadata,
    sqlalchemy.Column('recipe_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('recipes.id')),
    sqlalchemy.Column('ingredient_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('ingredients.id')),
    sqlalchemy.Column('quantity', sqlalchemy.String)
)

associated_users = sqlalchemy.Table(
    'recipes_to_users', SqlBase.metadata,
    sqlalchemy.Column('user_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('users.id')),
    sqlalchemy.Column('recipe_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('recipes.id'))
)
