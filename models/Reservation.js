'use strict';
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

class Reservation {
  static async create({ ticket_id, user_name, user_email, notes }) {
    const id = uuidv4();
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(
        'INSERT INTO reservations (id,ticket_id,user_name,user_email,notes) VALUES (?,?,?,?,?)',
        [id, ticket_id, user_name, user_email, notes||null]
      );
      await conn.query("UPDATE tickets SET status='reserved' WHERE id=?", [ticket_id]);
      await conn.commit();
      conn.release();
      return Reservation.findById(id);
    } catch (err) {
      await conn.rollback(); conn.release(); throw err;
    }
  }

  static async findAll() {
    const [rows] = await pool.query(`
      SELECT res.*, t.seat_number, t.price AS ticket_price,
             f.date AS function_date, f.time AS function_time,
             m.title AS movie_title, r.name AS room_name
      FROM reservations res
      JOIN tickets t ON res.ticket_id=t.id
      JOIN functions f ON t.function_id=f.id
      LEFT JOIN movies m ON f.movie_id=m.id
      JOIN rooms r ON f.room_id=r.id
      ORDER BY res.created_at DESC`);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM reservations WHERE id=?', [id]);
    return rows[0] || null;
  }

  static async update(id, { user_name, user_email, notes, status }) {
    const [result] = await pool.query(
      'UPDATE reservations SET user_name=COALESCE(?,user_name), user_email=COALESCE(?,user_email), notes=COALESCE(?,notes), status=COALESCE(?,status) WHERE id=?',
      [user_name, user_email, notes, status, id]
    );
    if (result.affectedRows === 0) return null;
    return Reservation.findById(id);
  }

  static async cancel(id) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [rows] = await conn.query("SELECT * FROM reservations WHERE id=? AND status='active'", [id]);
      if (rows.length === 0) { await conn.rollback(); conn.release(); return null; }
      await conn.query("UPDATE reservations SET status='cancelled' WHERE id=?", [id]);
      await conn.query("UPDATE tickets SET status='available', holder_name=NULL WHERE id=?", [rows[0].ticket_id]);
      await conn.commit(); conn.release();
      return Reservation.findById(id);
    } catch (err) {
      await conn.rollback(); conn.release(); throw err;
    }
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM reservations WHERE id=?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Reservation;
