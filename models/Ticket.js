'use strict';
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

class Ticket {
  static async create({ function_id, seat_number, price, holder_name }) {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO tickets (id,function_id,seat_number,price,holder_name) VALUES (?,?,?,?,?)',
      [id, function_id, seat_number, price, holder_name||null]
    );
    return Ticket.findById(id);
  }

  static async findAll() {
    const [rows] = await pool.query(`
      SELECT t.*, f.date AS function_date, f.time AS function_time, m.title AS movie_title, r.name AS room_name
      FROM tickets t
      JOIN functions f ON t.function_id=f.id
      LEFT JOIN movies m ON f.movie_id=m.id
      JOIN rooms r ON f.room_id=r.id
      ORDER BY t.created_at DESC`);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM tickets WHERE id=?', [id]);
    return rows[0] || null;
  }

  static async findByFunction(function_id) {
    const [rows] = await pool.query('SELECT * FROM tickets WHERE function_id=? ORDER BY seat_number ASC', [function_id]);
    return rows;
  }

  static async update(id, { seat_number, price, status, holder_name }) {
    const [result] = await pool.query(
      'UPDATE tickets SET seat_number=COALESCE(?,seat_number), price=COALESCE(?,price), status=COALESCE(?,status), holder_name=COALESCE(?,holder_name) WHERE id=?',
      [seat_number, price, status, holder_name, id]
    );
    if (result.affectedRows === 0) return null;
    return Ticket.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM tickets WHERE id=?', [id]);
    return result.affectedRows > 0;
  }

  static async reserve(id) {
    const [result] = await pool.query(
      "UPDATE tickets SET status='reserved' WHERE id=? AND status='available'", [id]
    );
    if (result.affectedRows === 0) return null;
    return Ticket.findById(id);
  }
}

module.exports = Ticket;
