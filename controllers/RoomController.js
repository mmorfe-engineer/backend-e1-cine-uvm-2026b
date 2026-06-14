'use strict';
const Room = require('../models/Room');

class RoomController {
  static async getAll(req, res) {
    try { const data = await Room.findAll(); res.status(200).json({ success:true, count:data.length, data }); }
    catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async getById(req, res) {
    try {
      const data = await Room.findById(req.params.id);
      if (!data) return res.status(404).json({ success:false, error:'Sala no encontrada' });
      res.status(200).json({ success:true, data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async create(req, res) {
    try {
      if (!req.body.name || !req.body.capacity) return res.status(400).json({ success:false, error:'name y capacity son requeridos' });
      const data = await Room.create(req.body);
      if (req.headers['content-type']?.includes('application/json')) return res.status(201).json({ success:true, data });
      res.redirect('/rooms/view');
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async update(req, res) {
    try {
      const data = await Room.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ success:false, error:'Sala no encontrada' });
      if (req.headers['content-type']?.includes('application/json')) return res.status(200).json({ success:true, data });
      res.redirect('/rooms/view');
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async delete(req, res) {
    try {
      const ok = await Room.delete(req.params.id);
      if (!ok) return res.status(404).json({ success:false, error:'Sala no encontrada' });
      if (req.headers.accept?.includes('application/json')) return res.status(200).json({ success:true, message:'Sala eliminada' });
      res.redirect('/rooms/view');
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async viewList(req, res) {
    try { const rooms = await Room.findAll(); res.render('rooms/list', { title:'Gestión de Salas', rooms }); }
    catch(err) { res.status(500).send(err.message); }
  }
  static async viewNew(req, res) { res.render('rooms/new', { title:'Nueva Sala' }); }
  static async viewEdit(req, res) {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) return res.redirect('/rooms/view');
      res.render('rooms/edit', { title:'Editar Sala', room });
    } catch(err) { res.status(500).send(err.message); }
  }
}
module.exports = RoomController;
