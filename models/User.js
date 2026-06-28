'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const pool = require('../config/db');

/**
 * Modelo User para autenticación JWT
 * Sistema de Gestión de Cine - UVM Backend 2026B - Trabajo 3
 * 
 * Roles disponibles: admin, staff, viewer
 */

class User {
  
  /**
   * Crea un nuevo usuario con contraseña hasheada
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.name - Nombre del usuario
   * @param {string} userData.email - Email único
   * @param {string} userData.password - Contraseña en texto plano (será hasheada)
   * @param {string} userData.role - Rol: admin, staff, viewer (default: viewer)
   * @returns {Promise<Object>} Usuario creado
   */
  static async create({ name, email, password, role = 'viewer' }) {
    // Validaciones
    if (!name || !email || !password) {
      throw new Error('name, email y password son requeridos');
    }
    
    if (!['admin', 'staff', 'viewer'].includes(role)) {
      throw new Error('role debe ser admin, staff o viewer');
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('email no es válido');
    }
    
    // Verificar que el email no exista
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('email ya está en uso');
    }
    
    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Crear usuario
    const id = uuidv4();
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role) 
       VALUES (?, ?, ?, ?, ?)`,
      [id, name, email, passwordHash, role]
    );
    
    return User.findById(id);
  }
  
  /**
   * Busca usuario por ID
   * @param {string} id - UUID del usuario
   * @returns {Promise<Object|null>} Usuario o null
   */
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? AND is_active = 1', [id]);
    return rows[0] || null;
  }
  
  /**
   * Busca usuario por email
   * @param {string} email - Email del usuario
   * @returns {Promise<Object|null>} Usuario o null
   */
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND is_active = 1', [email]);
    return rows[0] || null;
  }
  
  /**
   * Busca todos los usuarios
   * @returns {Promise<Array>} Lista de usuarios
   */
  static async findAll() {
    const [rows] = await pool.query('SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC');
    return rows;
  }
  
  /**
   * Actualiza un usuario
   * @param {string} id - UUID del usuario
   * @param {Object} fields - Campos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  static async update(id, fields) {
    const { name, email, password, role, is_active } = fields;
    
    // Si se cambia el email, verificar que no exista
    if (email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('email ya está en uso');
      }
    }
    
    // Si se cambia la contraseña, hashearla
    let passwordHash;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }
    
    // Construir la consulta dinámica
    const updates = [];
    const values = [];
    
    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (email !== undefined) { updates.push('email = ?'); values.push(email); }
    if (passwordHash !== undefined) { updates.push('password_hash = ?'); values.push(passwordHash); }
    if (role !== undefined) { updates.push('role = ?'); values.push(role); }
    if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active); }
    
    if (updates.length === 0) {
      throw new Error('No hay campos para actualizar');
    }
    
    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);
    
    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    return User.findById(id);
  }
  
  /**
   * Elimina un usuario (desactivación lógica)
   * @param {string} id - UUID del usuario
   * @returns {Promise<boolean>} Verdadero si se eliminó
   */
  static async delete(id) {
    const [result] = await pool.query('UPDATE users SET is_active = 0 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
  
  /**
   * Verifica la contraseña de un usuario
   * @param {string} password - Contraseña en texto plano
   * @param {string} passwordHash - Hash almacenado
   * @returns {Promise<boolean>} Verdadero si coincide
   */
  static async verifyPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
  }
  
  /**
   * Busca usuario por email y verifica contraseña (para login)
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña en texto plano
   * @returns {Promise<Object|null>} Usuario si es válido, null si no
   */
  static async findByEmailAndPassword(email, password) {
    const user = await User.findByEmail(email);
    if (!user) return null;
    
    const isValid = await User.verifyPassword(password, user.password_hash);
    return isValid ? user : null;
  }
}

module.exports = User;
