import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import orm

SqlBase = declarative_base()


class Recipe(SqlBase):
    __tablename__ = 'recipes'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    title = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    ingredients = orm.relationship('Ingredient', secondary='ingredients_to_recipes', backref='recipes')
    category = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('categories.id'))
    time = sqlalchemy.Column(sqlalchemy.Numeric, nullable=False)
    calories = sqlalchemy.Column(sqlalchemy.Numeric)
    proteins = sqlalchemy.Column(sqlalchemy.Numeric)
    fats = sqlalchemy.Column(sqlalchemy.Numeric)
    carbohydrates = sqlalchemy.Column(sqlalchemy.Numeric)


class Category(SqlBase):
    __tablename__ = 'categories'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    title = sqlalchemy.Column(sqlalchemy.String, nullable=False)


class Ingredient(SqlBase):
    __tablename__ = 'ingredients'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    title = sqlalchemy.Column(sqlalchemy.String, nullable=False)


associated_links = sqlalchemy.Table(
    'ingredients_to_recipes', SqlBase.metadata,
    sqlalchemy.Column('recipe_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('recipes.id')),
    sqlalchemy.Column('ingredient_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('ingredients.id'))
)




