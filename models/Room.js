const { v4: uuidv4 } = require('uuid');

let rooms = [];

class Room {
  constructor(name, capacity) {
    this.id = uuidv4();
    this.name = name;
    this.capacity = capacity;
    this.createdAt = new Date().toISOString();
  }

  static getAll() {
    return rooms;
  }

  static getById(id) {
    return rooms.find(r => r.id === id);
  }

  static add(room) {
    rooms.push(room);
    return room;
  }

  static getByName(name) {
    return rooms.find(r => r.name === name);
  }

  static update(id, name, capacity) {
    const room = rooms.find(r => r.id === id);
    if (room) {
      room.name = name;
      room.capacity = capacity;
      room.updatedAt = new Date().toISOString();
      return room;
    }
    return null;
  }

  static delete(id) {
    const index = rooms.findIndex(r => r.id === id);
    if (index > -1) {
      return rooms.splice(index, 1)[0];
    }
    return null;
  }
}

module.exports = Room;
