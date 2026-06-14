'use strict';
const CineFunction = require('../models/Function');

class FunctionController {
  static async getAll(req, res) {
    try { const data = await CineFunction.findAll(); res.status(200).json({ success:true, count:data.length, data }); }
    catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async getLast5(req, res) {
    try { const data = await CineFunction.getLast5(); res.status(200).json({ success:true, count:data.length, data }); }
    catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async getByDateRange(req, res) {
    try {
      const { start, end } = req.query;
      if (!start || !end) return res.status(400).json({ success:false, error:'Se requieren ?start=YYYY-MM-DD&end=YYYY-MM-DD' });
      const data = await CineFunction.getByDateRange(start, end);
      res.status(200).json({ success:true, count:data.length, data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async getById(req, res) {
    try {
      const data = await CineFunction.findById(req.params.id);
      if (!data) return res.status(404).json({ success:false, error:'Función no encontrada' });
      res.status(200).json({ success:true, data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async create(req, res) {
    try {
      const { room_id, date, time, price, available_seats } = req.body;
      if (!room_id||!date||!time||!price||!available_seats) return res.status(400).json({ success:false, error:'Faltan campos requeridos' });
      const data = await CineFunction.create(req.body);
      res.status(201).json({ success:true, data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async update(req, res) {
    try {
      const data = await CineFunction.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ success:false, error:'Función no encontrada' });
      res.status(200).json({ success:true, data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async unlinkMovie(req, res) {
    try {
      const data = await CineFunction.unlinkMovie(req.params.id);
      if (!data) return res.status(404).json({ success:false, error:'Función no encontrada' });
      res.status(200).json({ success:true, message:'Película desvinculada', data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async delete(req, res) {
    try {
      const ok = await CineFunction.delete(req.params.id);
      if (!ok) return res.status(404).json({ success:false, error:'Función no encontrada' });
      res.status(200).json({ success:true, message:'Función eliminada' });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
}
module.exports = FunctionController;
