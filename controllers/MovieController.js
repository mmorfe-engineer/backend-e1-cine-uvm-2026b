const Movie = require('../models/Movie');
const Function = require('../models/Function');

class MovieController {
  static getAll(req, res) {
    const allMovies = Movie.getAll();
    res.status(200).json({
      success: true,
      count: allMovies.length,
      data: allMovies
    });
  }

  static getById(req, res) {
    const { id } = req.params;
    const movie = Movie.getById(id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Película no encontrada',
        id: id
      });
    }

    res.status(200).json({
      success: true,
      data: movie
    });
  }

  static create(req, res) {
    const { title, duration } = req.body;

    if (!title || !duration) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos',
        required: ['title', 'duration']
      });
    }

    const newMovie = new Movie(title, duration);
    Movie.add(newMovie);

    res.status(201).json({
      success: true,
      message: 'Película creada exitosamente',
      data: newMovie
    });
  }

  static update(req, res) {
    const { id } = req.params;
    const { title, duration } = req.body;

    if (!title || !duration) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos para actualizar'
      });
    }

    const updated = Movie.update(id, title, duration);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Película no encontrada',
        id: id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Película actualizada exitosamente',
      data: updated
    });
  }

  static delete(req, res) {
    const { id } = req.params;

    const deleted = Movie.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Película no encontrada',
        id: id
      });
    }

    // Eliminar funciones asociadas
    Function.deleteByMovie(id);

    res.status(200).json({
      success: true,
      message: 'Película eliminada exitosamente',
      deletedId: id
    });
  }
}

module.exports = MovieController;
