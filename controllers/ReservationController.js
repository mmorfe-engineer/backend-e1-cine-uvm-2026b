'use strict';
const Reservation = require('../models/Reservation');

class ReservationController {
  static async getAll(req, res) {
    try { const data = await Reservation.findAll(); res.status(200).json({ success:true, count:data.length, data }); }
    catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async getById(req, res) {
    try {
      const data = await Reservation.findById(req.params.id);
      if (!data) return res.status(404).json({ success:false, error:'Reservación no encontrada' });
      res.status(200).json({ success:true, data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async create(req, res) {
    try {
      const { ticket_id, user_name, user_email } = req.body;
      if (!ticket_id||!user_name||!user_email) return res.status(400).json({ success:false, error:'ticket_id, user_name y user_email son requeridos' });
      const data = await Reservation.create(req.body);
      res.status(201).json({ success:true, data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async update(req, res) {
    try {
      const data = await Reservation.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ success:false, error:'Reservación no encontrada' });
      res.status(200).json({ success:true, data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async cancel(req, res) {
    try {
      const data = await Reservation.cancel(req.params.id);
      if (!data) return res.status(404).json({ success:false, error:'Reservación no encontrada o ya cancelada' });
      res.status(200).json({ success:true, message:'Reservación cancelada y ticket liberado', data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async delete(req, res) {
    try {
      const ok = await Reservation.delete(req.params.id);
      if (!ok) return res.status(404).json({ success:false, error:'Reservación no encontrada' });
      res.status(200).json({ success:true, message:'Reservación eliminada' });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
}
module.exports = ReservationController;
