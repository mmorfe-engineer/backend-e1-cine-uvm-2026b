const { v4: uuidv4 } = require('uuid');

let reservations = [];

class Reservation {
  constructor(ticketId, userName, userEmail) {
    this.id = uuidv4();
    this.ticketId = ticketId;
    this.userName = userName;
    this.userEmail = userEmail;
    this.status = 'confirmed';
    this.createdAt = new Date().toISOString();
  }

  static getAll() {
    return reservations;
  }

  static getById(id) {
    return reservations.find(r => r.id === id);
  }

  static add(reservation) {
    reservations.push(reservation);
    return reservation;
  }

  static getByTicket(ticketId) {
    return reservations.find(r => r.ticketId === ticketId);
  }

  static update(id, status) {
    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
      reservation.status = status;
      reservation.updatedAt = new Date().toISOString();
      return reservation;
    }
    return null;
  }

  static cancel(id) {
    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
      reservation.status = 'cancelled';
      reservation.cancelledAt = new Date().toISOString();
      return reservation;
    }
    return null;
  }

  static delete(id) {
    const index = reservations.findIndex(r => r.id === id);
    if (index > -1) {
      return reservations.splice(index, 1)[0];
    }
    return null;
  }

  static deleteByTicket(ticketId) {
    reservations = reservations.filter(r => r.ticketId !== ticketId);
  }
}

module.exports = Reservation;
