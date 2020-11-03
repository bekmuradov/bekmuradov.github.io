import flask
from flask import request, jsonify, render_template, redirect, url_for
import csv

app = flask.Flask(__name__)
app.config["DEBUG"] =  False

def capitalize_words_space(title):
    return " ".join([
        word.capitalize()
        for word in title.split(' ')
    ])

def capitalize_words_plus(title):
    return " ".join([
        word.capitalize()
        for word in title.split('+')
    ])

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/v1/resources/movies/all', methods=['GET'])
def api_movies():
    movies = []
    with open("tmdb_5000_movies.csv", "r") as file:
        reader = csv.DictReader(file)

        for row in reader:
            movies.append(row)
    file.closed
    print(len(movies))
    return jsonify(movies)

@app.route('/api/v1/resources/movies/search', methods=['GET'])
def api_movie_search():
    movie = []
    if 'keywords' in request.args:
        keywords = request.args['keywords']
    else:
        keywords = ""
    if 'year' in request.args:
        year = request.args['year']
    else:
        year = ""
    if 'genre' in request.args:
        genre = request.args['genre']
    else:
        genre = ""

    if keywords == "" and year == "" and genre == "":
        return redirect(url_for('home'))
    with open("tmdb_5000_movies.csv", "r") as file:
        reader = csv.DictReader(file)

        for row in reader:
            if keywords in row["keywords"] and year in row["release_date"] and capitalize_words_space(genre) in row["genres"]:
                movie.append(row)
    file.closed
    return jsonify(movie)

@app.route('/api/v1/resources/movies/title/<title>', methods=['GET'])
def api_movie_title(title):
    movie = []
    capitalized_title = capitalize_words_plus(title)
    with open("tmdb_5000_movies.csv", "r") as file:
        reader = csv.DictReader(file)

        for row in reader:
            if capitalized_title in capitalize_words_space(row['title']):
                movie.append(row)
    file.closed
    return jsonify(movie)

@app.route('/api/v1/resources/movies/keyword/<keyword>', methods=['GET'])
def api_movie_keyword(keyword):
    movie = []
    with open("tmdb_5000_movies.csv", "r") as file:
        reader = csv.DictReader(file)

        for row in reader:
            if keyword.replace('+', ' ') in row["keywords"]:
                movie.append(row)
    file.closed
    return jsonify(movie)

@app.route('/api/v1/resources/movies/genre/<genre>', methods=['GET'])
def api_movie_genre(genre):
    movie = []
    capitalized_genres = capitalize_words_plus(genre)
    with open("tmdb_5000_movies.csv", "r") as file:
        reader = csv.DictReader(file)

        for row in reader:
            if capitalized_genres in row["genres"]:
                movie.append(row)
    file.closed
    return jsonify(movie)


if __name__ == "__main__":
    app.run()