const { v4: uuidv4 } = require('uuid');

let movies = [];

class Movie {
  constructor(title, duration) {
    this.id = uuidv4();
    this.title = title;
    this.duration = duration;
    this.createdAt = new Date().toISOString();
  }

  static getAll() {
    return movies;
  }

  static getById(id) {
    return movies.find(m => m.id === id);
  }

  static add(movie) {
    movies.push(movie);
    return movie;
  }

  static update(id, title, duration) {
    const movie = movies.find(m => m.id === id);
    if (movie) {
      movie.title = title;
      movie.duration = duration;
      movie.updatedAt = new Date().toISOString();
      return movie;
    }
    return null;
  }

  static delete(id) {
    const index = movies.findIndex(m => m.id === id);
    if (index > -1) {
      return movies.splice(index, 1)[0];
    }
    return null;
  }

  static deleteByMovieId(movieId) {
    movies = movies.filter(m => m.id !== movieId);
  }
}

module.exports = Movie;
