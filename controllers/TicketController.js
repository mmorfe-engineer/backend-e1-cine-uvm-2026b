const Ticket = require('../models/Ticket');
const Reservation = require('../models/Reservation');

class TicketController {
  static getAll(req, res) {
    const allTickets = Ticket.getAll();
    res.status(200).json({
      success: true,
      count: allTickets.length,
      data: allTickets
    });
  }

  static getById(req, res) {
    const { id } = req.params;
    const ticket = Ticket.getById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket no encontrado',
        id: id
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  }

  static getByFunction(req, res) {
    const { functionId } = req.params;
    const tickets = Ticket.getByFunction(functionId);

    res.status(200).json({
      success: true,
      functionId: functionId,
      count: tickets.length,
      data: tickets
    });
  }

  static create(req, res) {
    const { functionId, seatNumber, price } = req.body;

    if (!functionId || !seatNumber || !price) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos',
        required: ['functionId', 'seatNumber', 'price']
      });
    }

    const newTicket = new Ticket(functionId, seatNumber, price);
    Ticket.add(newTicket);

    res.status(201).json({
      success: true,
      message: 'Ticket creado exitosamente',
      data: newTicket
    });
  }

  static reserve(req, res) {
    const { id } = req.params;

    const reserved = Ticket.reserve(id);

    if (!reserved) {
      return res.status(400).json({
        success: false,
        error: 'No se pudo reservar. El ticket no existe o ya está reservado',
        id: id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket reservado exitosamente',
      data: reserved
    });
  }

  static update(req, res) {
    const { id } = req.params;
    const { seatNumber, price } = req.body;

    if (!seatNumber || !price) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos para actualizar'
      });
    }

    const updated = Ticket.update(id, seatNumber, price);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Ticket no encontrado',
        id: id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket actualizado exitosamente',
      data: updated
    });
  }

  static delete(req, res) {
    const { id } = req.params;

    const deleted = Ticket.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Ticket no encontrado',
        id: id
      });
    }

    // Eliminar reservación asociada
    Reservation.deleteByTicket(id);

    res.status(200).json({
      success: true,
      message: 'Ticket eliminado exitosamente',
      deletedId: id
    });
  }
}

module.exports = TicketController;
