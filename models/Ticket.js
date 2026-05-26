const { v4: uuidv4 } = require('uuid');

let tickets = [];

class Ticket {
  constructor(functionId, seatNumber, price) {
    this.id = uuidv4();
    this.functionId = functionId;
    this.seatNumber = seatNumber;
    this.price = price;
    this.status = 'available';
    this.createdAt = new Date().toISOString();
  }

  static getAll() {
    return tickets;
  }

  static getById(id) {
    return tickets.find(t => t.id === id);
  }

  static add(ticket) {
    tickets.push(ticket);
    return ticket;
  }

  static getByFunction(functionId) {
    return tickets.filter(t => t.functionId === functionId);
  }

  static reserve(id) {
    const ticket = tickets.find(t => t.id === id);
    if (ticket && ticket.status === 'available') {
      ticket.status = 'reserved';
      ticket.reservedAt = new Date().toISOString();
      return ticket;
    }
    return null;
  }

  static update(id, seatNumber, price) {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      ticket.seatNumber = seatNumber;
      ticket.price = price;
      ticket.updatedAt = new Date().toISOString();
      return ticket;
    }
    return null;
  }

  static delete(id) {
    const index = tickets.findIndex(t => t.id === id);
    if (index > -1) {
      return tickets.splice(index, 1)[0];
    }
    return null;
  }

  static deleteByFunction(functionId) {
    tickets = tickets.filter(t => t.functionId !== functionId);
  }
}

module.exports = Ticket;
