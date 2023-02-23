import sqlite3


class Database:

    def __init__(self):
        """Подключаемся к БД"""
        self.connection = sqlite3.connect('db.db')
        self.cursor = self.connection.cursor()
        with self.connection:
            pass

    def add_recipe(self):
        """ Добаляем рецепт в БД"""
        pass

    def rem_recipes(self):
        """Удаляем рецепт из БД"""
        pass

    def edit_recipes(self):
        """Редактируем рецепт в БД"""
        pass

    def get_recipes(self):
        """Получаем рецепт в БД"""
        pass
