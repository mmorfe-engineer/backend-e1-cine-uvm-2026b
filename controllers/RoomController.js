const Room = require('../models/Room');

class RoomController {
  static getAll(req, res) {
    const allRooms = Room.getAll();
    res.status(200).json({
      success: true,
      count: allRooms.length,
      data: allRooms
    });
  }

  static getById(req, res) {
    const { id } = req.params;
    const room = Room.getById(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Sala no encontrada',
        id: id
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  }

  static create(req, res) {
    const { name, capacity } = req.body;

    if (!name || !capacity) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos',
        required: ['name', 'capacity']
      });
    }

    const newRoom = new Room(name, capacity);
    Room.add(newRoom);

    res.status(201).json({
      success: true,
      message: 'Sala creada exitosamente',
      data: newRoom
    });
  }

  static update(req, res) {
    const { id } = req.params;
    const { name, capacity } = req.body;

    if (!name || !capacity) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos para actualizar'
      });
    }

    const updated = Room.update(id, name, capacity);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Sala no encontrada',
        id: id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sala actualizada exitosamente',
      data: updated
    });
  }

  static delete(req, res) {
    const { id } = req.params;

    const deleted = Room.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Sala no encontrada',
        id: id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sala eliminada exitosamente',
      deletedId: id
    });
  }
}

module.exports = RoomController;
