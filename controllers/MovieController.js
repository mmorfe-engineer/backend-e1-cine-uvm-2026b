'use strict';
const Movie = require('../models/Movie');

class MovieController {
  static async getAll(req, res) {
    try { const data = await Movie.findAll(); res.status(200).json({ success:true, count:data.length, data }); }
    catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async getById(req, res) {
    try {
      const data = await Movie.findById(req.params.id);
      if (!data) return res.status(404).json({ success:false, error:'Película no encontrada' });
      res.status(200).json({ success:true, data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async getWithFunctions(req, res) {
    try {
      const data = await Movie.findWithFunctions(req.params.id);
      if (!data) return res.status(404).json({ success:false, error:'Película no encontrada' });
      res.status(200).json({ success:true, data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async create(req, res) {
    try {
      const { title, duration } = req.body;
      if (!title || !duration) return res.status(400).json({ success:false, error:'title y duration son requeridos' });
      const data = await Movie.create(req.body);
      res.status(201).json({ success:true, data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async update(req, res) {
    try {
      const data = await Movie.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ success:false, error:'Película no encontrada' });
      res.status(200).json({ success:true, data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async delete(req, res) {
    try {
      const ok = await Movie.delete(req.params.id);
      if (!ok) return res.status(404).json({ success:false, error:'Película no encontrada' });
      res.status(200).json({ success:true, message:'Película eliminada' });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async viewList(req, res) {
    try { const movies = await Movie.findAll(); res.render('movies/list', { title:'Gestión de Películas', movies }); }
    catch(err) { res.status(500).send(err.message); }
  }
  static async viewNew(req, res) { res.render('movies/new', { title:'Nueva Película' }); }
  static async viewEdit(req, res) {
    try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) return res.redirect('/movies/view');
      res.render('movies/edit', { title:'Editar Película', movie });
    } catch(err) { res.status(500).send(err.message); }
  }
}
module.exports = MovieController;
