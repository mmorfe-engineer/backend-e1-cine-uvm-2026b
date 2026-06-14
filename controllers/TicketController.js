'use strict';
const Ticket = require('../models/Ticket');

class TicketController {
  static async getAll(req, res) {
    try { const data = await Ticket.findAll(); res.status(200).json({ success:true, count:data.length, data }); }
    catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async getById(req, res) {
    try {
      const data = await Ticket.findById(req.params.id);
      if (!data) return res.status(404).json({ success:false, error:'Ticket no encontrado' });
      res.status(200).json({ success:true, data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async getByFunction(req, res) {
    try { const data = await Ticket.findByFunction(req.params.functionId); res.status(200).json({ success:true, count:data.length, data }); }
    catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async create(req, res) {
    try {
      const { function_id, seat_number, price } = req.body;
      if (!function_id||!seat_number||!price) return res.status(400).json({ success:false, error:'function_id, seat_number y price son requeridos' });
      const data = await Ticket.create(req.body);
      res.status(201).json({ success:true, data });
    } catch(err) {
      if (err.code==='ER_DUP_ENTRY') return res.status(409).json({ success:false, error:'Asiento ya existe en esta función' });
      res.status(500).json({ success:false, error:err.message });
    }
  }
  static async update(req, res) {
    try {
      const data = await Ticket.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ success:false, error:'Ticket no encontrado' });
      res.status(200).json({ success:true, data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async delete(req, res) {
    try {
      const ok = await Ticket.delete(req.params.id);
      if (!ok) return res.status(404).json({ success:false, error:'Ticket no encontrado' });
      res.status(200).json({ success:true, message:'Ticket eliminado' });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async reserve(req, res) {
    try {
      const data = await Ticket.reserve(req.params.id);
      if (!data) return res.status(409).json({ success:false, error:'Ticket no disponible' });
      res.status(200).json({ success:true, data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
}
module.exports = TicketController;
