'use strict';
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

class Movie {
  static async create({ title, genre, duration, rating, synopsis, director, release_year, poster_url }) {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO movies (id,title,genre,duration,rating,synopsis,director,release_year,poster_url)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [id, title, genre||'Sin clasificar', duration, rating||'G', synopsis||null, director||null, release_year||null, poster_url||null]
    );
    return Movie.findById(id);
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM movies WHERE is_active=1 ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM movies WHERE id=? AND is_active=1', [id]);
    return rows[0] || null;
  }

  static async findWithFunctions(id) {
    const movie = await Movie.findById(id);
    if (!movie) return null;
    const [functions] = await pool.query(
      `SELECT f.*, r.name AS room_name FROM functions f
       JOIN rooms r ON f.room_id=r.id WHERE f.movie_id=? ORDER BY f.date DESC`, [id]
    );
    return { ...movie, functions };
  }

  static async update(id, fields) {
    const { title, genre, duration, rating, synopsis, director, release_year, poster_url } = fields;
    await pool.query(
      `UPDATE movies SET
        title=COALESCE(?,title), genre=COALESCE(?,genre), duration=COALESCE(?,duration),
        rating=COALESCE(?,rating), synopsis=COALESCE(?,synopsis), director=COALESCE(?,director),
        release_year=COALESCE(?,release_year), poster_url=COALESCE(?,poster_url)
       WHERE id=? AND is_active=1`,
      [title,genre,duration,rating,synopsis,director,release_year,poster_url,id]
    );
    return Movie.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('UPDATE movies SET is_active=0 WHERE id=? AND is_active=1', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Movie;
