'use strict';
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

class CineFunction {
  static async create({ movie_id, room_id, date, time, price, available_seats, language, format }) {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO functions (id,movie_id,room_id,date,time,price,available_seats,language,format) VALUES (?,?,?,?,?,?,?,?,?)',
      [id, movie_id||null, room_id, date, time, price, available_seats, language||'Español', format||'2D']
    );
    return CineFunction.findById(id);
  }

  static async findAll() {
    const [rows] = await pool.query(`
      SELECT f.*, m.title AS movie_title, r.name AS room_name
      FROM functions f
      LEFT JOIN movies m ON f.movie_id=m.id
      INNER JOIN rooms r ON f.room_id=r.id
      ORDER BY f.date DESC, f.time DESC`);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(`
      SELECT f.*, m.title AS movie_title, r.name AS room_name
      FROM functions f
      LEFT JOIN movies m ON f.movie_id=m.id
      INNER JOIN rooms r ON f.room_id=r.id
      WHERE f.id=?`, [id]);
    return rows[0] || null;
  }

  static async getLast5() {
    const [rows] = await pool.query(`
      SELECT f.*, m.title AS movie_title, m.genre AS movie_genre,
             r.name AS room_name, r.type AS room_type
      FROM functions f
      LEFT JOIN movies m ON f.movie_id=m.id
      INNER JOIN rooms r ON f.room_id=r.id
      ORDER BY f.date DESC, f.time DESC
      LIMIT 5`);
    return rows;
  }

  static async getByDateRange(start, end) {
    const [rows] = await pool.query(`
      SELECT f.*, m.title AS movie_title, r.name AS room_name
      FROM functions f
      LEFT JOIN movies m ON f.movie_id=m.id
      INNER JOIN rooms r ON f.room_id=r.id
      WHERE f.date BETWEEN ? AND ?
      ORDER BY f.date ASC, f.time ASC`, [start, end]);
    return rows;
  }

  static async update(id, fields) {
    const allowed = ['movie_id','room_id','date','time','price','available_seats','language','format','status'];
    const sets = []; const vals = [];
    for (const k of allowed) {
      if (fields[k] !== undefined) { sets.push(`${k}=?`); vals.push(fields[k]); }
    }
    if (!sets.length) return CineFunction.findById(id);
    vals.push(id);
    await pool.query(`UPDATE functions SET ${sets.join(',')} WHERE id=?`, vals);
    return CineFunction.findById(id);
  }

  static async unlinkMovie(id) {
    const [result] = await pool.query('UPDATE functions SET movie_id=NULL WHERE id=?', [id]);
    if (result.affectedRows === 0) return null;
    return CineFunction.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM functions WHERE id=?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = CineFunction;
