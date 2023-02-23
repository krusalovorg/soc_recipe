import sys

from flask import Flask, flash, render_template, url_for, request, redirect, abort

app = Flask(__name__)
app.config['SECRET_KEY'] = "SECRET_VERY_SECRET_KEY"


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
