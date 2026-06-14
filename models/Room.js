'use strict';
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

class Room {
  static async create({ name, capacity, type, has_accessibility }) {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO rooms (id,name,capacity,type,has_accessibility) VALUES (?,?,?,?,?)',
      [id, name, capacity, type||'Regular', has_accessibility ? 1 : 0]
    );
    return Room.findById(id);
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM rooms WHERE is_active=1 ORDER BY name ASC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM rooms WHERE id=? AND is_active=1', [id]);
    return rows[0] || null;
  }

  static async update(id, { name, capacity, type, has_accessibility }) {
    const [result] = await pool.query(
      `UPDATE rooms SET name=COALESCE(?,name), capacity=COALESCE(?,capacity),
        type=COALESCE(?,type), has_accessibility=COALESCE(?,has_accessibility)
       WHERE id=? AND is_active=1`,
      [name, capacity, type, has_accessibility !== undefined ? (has_accessibility ? 1 : 0) : null, id]
    );
    if (result.affectedRows === 0) return null;
    return Room.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('UPDATE rooms SET is_active=0 WHERE id=? AND is_active=1', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Room;
