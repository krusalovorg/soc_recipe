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
    time = sqlalchemy.Column(sqlalchemy.Numeric, nullable=False)
    calories = sqlalchemy.Column(sqlalchemy.Numeric)
    proteins = sqlalchemy.Column(sqlalchemy.Numeric)
    fats = sqlalchemy.Column(sqlalchemy.Numeric)
    carbohydrates = sqlalchemy.Column(sqlalchemy.Numeric)

    ingredients = orm.relationship('Ingredient', secondary='ingredients_to_recipes', backref='recipes')


class Category(SqlBase):
    __tablename__ = 'categories'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    title = sqlalchemy.Column(sqlalchemy.String, nullable=False)


class Ingredient(SqlBase):
    __tablename__ = 'ingredients'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    title = sqlalchemy.Column(sqlalchemy.String, nullable=False)


class User(SqlBase, UserMixin, SerializerMixin):
    __tablename__ = 'users'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    surname = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    email = sqlalchemy.Column(sqlalchemy.String, index=True, unique=True, nullable=True)
    hashed_password = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    created_date = sqlalchemy.Column(sqlalchemy.DateTime, default=datetime.datetime.now)

    likes = orm.relationship('Recipe', secondary='recipes_to_users', backref='users')

    def __repr__(self):
        return f'<User> {self.id} {self.surname} {self.name}'

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)


associated_recipes = sqlalchemy.Table(
    'ingredients_to_recipes', SqlBase.metadata,
    sqlalchemy.Column('recipe_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('recipes.id')),
    sqlalchemy.Column('ingredient_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('ingredients.id'))
)


associated_users = sqlalchemy.Table(
    'recipes_to_users', SqlBase.metadata,
    sqlalchemy.Column('user_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('users.id')),
    sqlalchemy.Column('recipe_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('recipes.id'))
)



