const Reservation = require('../models/Reservation');

class ReservationController {
  static getAll(req, res) {
    const allReservations = Reservation.getAll();
    res.status(200).json({
      success: true,
      count: allReservations.length,
      data: allReservations
    });
  }

  static getById(req, res) {
    const { id } = req.params;
    const reservation = Reservation.getById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reservación no encontrada',
        id: id
      });
    }

    res.status(200).json({
      success: true,
      data: reservation
    });
  }

  static create(req, res) {
    const { ticketId, userName, userEmail } = req.body;

    if (!ticketId || !userName || !userEmail) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos',
        required: ['ticketId', 'userName', 'userEmail']
      });
    }

    const newReservation = new Reservation(ticketId, userName, userEmail);
    Reservation.add(newReservation);

    res.status(201).json({
      success: true,
      message: 'Reservación creada exitosamente',
      data: newReservation
    });
  }

  static update(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Falta el campo status'
      });
    }

    const updated = Reservation.update(id, status);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Reservación no encontrada',
        id: id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reservación actualizada exitosamente',
      data: updated
    });
  }

  static cancel(req, res) {
    const { id } = req.params;

    const cancelled = Reservation.cancel(id);

    if (!cancelled) {
      return res.status(404).json({
        success: false,
        error: 'Reservación no encontrada',
        id: id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reservación cancelada exitosamente',
      data: cancelled
    });
  }

  static delete(req, res) {
    const { id } = req.params;

    const deleted = Reservation.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Reservación no encontrada',
        id: id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reservación eliminada exitosamente',
      deletedId: id
    });
  }
}

module.exports = ReservationController;
