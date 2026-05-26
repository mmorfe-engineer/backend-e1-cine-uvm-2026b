const Function = require('../models/Function');
const Ticket = require('../models/Ticket');

class FunctionController {
  static getAll(req, res) {
    const allFunctions = Function.getAll();
    res.status(200).json({
      success: true,
      count: allFunctions.length,
      data: allFunctions
    });
  }

  static getById(req, res) {
    const { id } = req.params;
    const fn = Function.getById(id);

    if (!fn) {
      return res.status(404).json({
        success: false,
        error: 'Función no encontrada',
        id: id
      });
    }

    res.status(200).json({
      success: true,
      data: fn
    });
  }

  static create(req, res) {
    const { movieId, roomId, date, time } = req.body;

    if (!movieId || !roomId || !date || !time) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos',
        required: ['movieId', 'roomId', 'date', 'time']
      });
    }

    const newFunction = new Function(movieId, roomId, date, time);
    Function.add(newFunction);

    res.status(201).json({
      success: true,
      message: 'Función creada exitosamente',
      data: newFunction
    });
  }

  static getLast5(req, res) {
    const last5 = Function.getLast5();
    res.status(200).json({
      success: true,
      count: last5.length,
      data: last5
    });
  }

  static getByDateRange(req, res) {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        error: 'Parámetros requeridos: start y end',
        example: '?start=2026-06-01&end=2026-06-30'
      });
    }

    const functions = Function.getByDateRange(start, end);

    res.status(200).json({
      success: true,
      range: { start, end },
      count: functions.length,
      data: functions
    });
  }

  static update(req, res) {
    const { id } = req.params;
    const { movieId, roomId, date, time } = req.body;

    if (!movieId || !roomId || !date || !time) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos para actualizar'
      });
    }

    const updated = Function.update(id, movieId, roomId, date, time);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Función no encontrada',
        id: id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Función actualizada exitosamente',
      data: updated
    });
  }

  static delete(req, res) {
    const { id } = req.params;

    const deleted = Function.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Función no encontrada',
        id: id
      });
    }

    // Eliminar tickets asociados
    Ticket.deleteByFunction(id);

    res.status(200).json({
      success: true,
      message: 'Función eliminada exitosamente',
      deletedId: id
    });
  }

  static deleteByMovie(req, res) {
    const { id, movieId } = req.params;

    const fn = Function.getById(id);
    if (!fn) {
      return res.status(404).json({
        success: false,
        error: 'Función no encontrada'
      });
    }

    Function.delete(id);
    Ticket.deleteByFunction(id);

    res.status(200).json({
      success: true,
      message: 'Función y sus tickets eliminados',
      deletedId: id
    });
  }
}

module.exports = FunctionController;
