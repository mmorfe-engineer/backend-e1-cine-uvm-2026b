'use strict';
const Reservation = require('../models/Reservation');
const User = require('../models/User');

class ReservationController {
  static async getAll(req, res) {
    try {
      let data;
      const user = req.user;
      
      // Si el usuario es admin o staff, ver todas las reservaciones
      if (user && ['admin', 'staff'].includes(user.role)) {
        data = await Reservation.findAll();
      } else if (user) {
        // Viewer: solo sus propias reservaciones
        data = await Reservation.findByUserId(user.sub || user.id);
      } else {
        // Sin autenticación: no puede ver reservaciones
        return res.status(401).json({ success:false, error:'No autorizado' });
      }
      
      res.status(200).json({ success:true, count:data.length, data });
    }
    catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async getById(req, res) {
    try {
      const data = await Reservation.findById(req.params.id);
      if (!data) return res.status(404).json({ success:false, error:'Reservación no encontrada' });
      
      // Verificar permisos: admin/staff pueden ver cualquier reservación
      // viewer solo puede ver sus propias reservaciones
      const user = req.user;
      const isOwner = user && (user.sub || user.id) === data.user_id;
      const isAdminOrStaff = user && ['admin', 'staff'].includes(user.role);
      
      if (!isOwner && !isAdminOrStaff) {
        return res.status(403).json({
          success: false,
          error: 'No autorizado. Solo puedes ver tus propias reservaciones.'
        });
      }
      
      res.status(200).json({ success:true, data });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async create(req, res) {
    try {
      const { ticket_id, user_name, user_email, notes } = req.body;
      const user = req.user;
      
      // Si hay usuario autenticado, usar sus datos
      if (user) {
        const fullUser = await User.findById(user.sub || user.id);
        if (fullUser) {
          // Usar datos del usuario autenticado
          const reservationData = {
            ticket_id,
            user_id: user.sub || user.id,
            user_name: user.name,
            user_email: user.email || fullUser.email,
            notes
          };
          const data = await Reservation.create(reservationData);
          
          if (req.accepts('html')) {
            return res.redirect('/reservations/view');
          }
          return res.status(201).json({ success:true, data });
        }
      }
      
      // Sin autenticación (no debería pasar por el middleware, pero por si acaso)
      if (!ticket_id || !user_name || !user_email) {
        if (req.accepts('html')) {
          return res.status(400).render('errors/400', {
            title: 'Error',
            message: 'ticket_id, user_name y user_email son requeridos'
          });
        }
        return res.status(400).json({ success:false, error:'ticket_id, user_name y user_email son requeridos' });
      }
      
      const data = await Reservation.create(req.body);
      if (req.accepts('html')) {
        return res.redirect('/reservations/view');
      }
      res.status(201).json({ success:true, data });
    } catch(err) {
      if (req.accepts('html')) {
        return res.status(500).render('errors/500', {
          title: 'Error',
          message: 'Error al crear la reservación'
        });
      }
      res.status(500).json({ success:false, error:err.message });
    }
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
      const reservation = await Reservation.findById(req.params.id);
      if (!reservation) {
        if (req.accepts('html')) {
          return res.status(404).render('errors/404', {
            title: 'Reservación no encontrada',
            message: 'Reservación no encontrada o ya cancelada'
          });
        }
        return res.status(404).json({ success:false, error:'Reservación no encontrada o ya cancelada' });
      }
      
      // Verificar permisos: admin/staff pueden cancelar cualquier reservación
      // viewer solo puede cancelar sus propias reservaciones
      const user = req.user;
      const isOwner = user && user.sub && user.sub === reservation.user_id;
      const isAdminOrStaff = user && ['admin', 'staff'].includes(user.role);
      
      if (!isOwner && !isAdminOrStaff) {
        if (req.accepts('html')) {
          return res.status(403).render('errors/403', {
            title: '403 - Prohibido',
            message: 'No puedes cancelar esta reservación. Solo puedes cancelar tus propias reservaciones.'
          });
        }
        return res.status(403).json({
          success: false,
          error: 'No autorizado. Solo puedes cancelar tus propias reservaciones.'
        });
      }
      
      const data = await Reservation.cancel(req.params.id);
      if (!data) {
        if (req.accepts('html')) {
          return res.status(400).render('errors/400', {
            title: 'Error',
            message: 'No se pudo cancelar la reservación'
          });
        }
        return res.status(400).json({ success:false, error:'No se pudo cancelar la reservación' });
      }
      
      if (req.accepts('html')) {
        return res.redirect('/reservations/view');
      }
      res.status(200).json({ success:true, message:'Reservación cancelada y ticket liberado', data });
    } catch(err) {
      if (req.accepts('html')) {
        return res.status(500).render('errors/500', {
          title: 'Error',
          message: 'Error interno del servidor'
        });
      }
      res.status(500).json({ success:false, error:err.message });
    }
  }
  static async delete(req, res) {
    try {
      const ok = await Reservation.delete(req.params.id);
      if (!ok) return res.status(404).json({ success:false, error:'Reservación no encontrada' });
      res.status(200).json({ success:true, message:'Reservación eliminada' });
    } catch(err) { res.status(500).json({ success:false, error:err.message }); }
  }
  static async viewList(req, res) {
    try {
      let reservations;
      const user = req.user;
      
      // Si el usuario es admin o staff, ver todas las reservaciones
      if (user && ['admin', 'staff'].includes(user.role)) {
        reservations = await Reservation.findAll();
      } else if (user) {
        // Viewer: solo sus propias reservaciones
        reservations = await Reservation.findByUserId(user.sub || user.id);
      } else {
        // Sin autenticación: no puede ver reservaciones
        return res.status(401).render('errors/401', {
          title: 'No autorizado',
          message: 'Debes iniciar sesión para ver tus reservaciones'
        });
      }
      
      res.render('reservations/list', { 
        title:'Gestión de Reservaciones', 
        reservations,
        user
      });
    } catch(err) {
      res.status(500).render('errors/500', {
        title: 'Error',
        message: err.message
      });
    }
  }
  static async viewNew(req, res) { res.render('reservations/new', { title:'Nueva Reservación' }); }
  static async viewEdit(req, res) {
    try {
      const reservation = await Reservation.findById(req.params.id);
      if (!reservation) return res.redirect('/reservations/view');
      res.render('reservations/edit', { title:'Editar Reservación', reservation });
    } catch(err) { res.status(500).send(err.message); }
  }
}
module.exports = ReservationController;
