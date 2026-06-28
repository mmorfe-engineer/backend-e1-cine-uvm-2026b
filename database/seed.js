#!/usr/bin/env node
'use strict';

/**
 * Script de Seed para Base de Datos
 * Sistema de Gestión de Cine - UVM Backend 2026B - Trabajo 3
 * 
 * Este script inserta datos iniciales de usuarios con contraseñas hasheadas.
 * NOTA: Este script asume que la tabla users ya existe.
 * 
 * Uso:
 *   npm run seed
 * 
 * Requisitos:
 *   - MySQL 8.0+ en ejecución
 *   - Base de datos cine_uvm creada
 *   - Variables de entorno configuradas
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Configuración de conexión
const dbConfig = {
  host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306'),
  user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'cine_uvm'
};

// Usuarios por defecto (contraseñas en texto plano para hashear)
const defaultUsers = [
  {
    id: 'f1e2d3c4-0001-4000-8000-000000000001',
    name: 'Admin UVM',
    email: 'admin@cine-uvm.edu.ve',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 'f1e2d3c4-0002-4000-8000-000000000002',
    name: 'Martín Morfe',
    email: 'mmorfe@cine-uvm.edu.ve',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 'f1e2d3c4-0003-4000-8000-000000000003',
    name: 'Martín Alejandro',
    email: 'mcarballo@cine-uvm.edu.ve',
    password: 'staff123',
    role: 'staff'
  },
  {
    id: 'f1e2d3c4-0004-4000-8000-000000000004',
    name: 'Taquilla UVM',
    email: 'taquilla@cine-uvm.edu.ve',
    password: 'staff123',
    role: 'staff'
  },
  {
    id: 'f1e2d3c4-0005-4000-8000-000000000005',
    name: 'Cliente Prueba',
    email: 'cliente@test.com',
    password: 'viewer123',
    role: 'viewer'
  }
];

async function seedUsers() {
  let connection;
  
  try {
    console.log('🌱 Iniciando seed de usuarios...\n');
    
    // Crear conexión
    connection = await mysql.createConnection(dbConfig);
    console.log(`🔗 Conectado a ${dbConfig.database}\n`);
    
    // Verificar si la tabla users existe
    const [tables] = await connection.query(
      `SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'`,
      [dbConfig.database]
    );
    
    if (tables[0].count === 0) {
      throw new Error('❌ La tabla users no existe. Ejecuta npm run migrate primero.');
    }
    
    // Limpiar usuarios existentes (opcional, descomentar si se quiere resetear)
    // await connection.query('TRUNCATE TABLE users');
    
    // Verificar si ya hay usuarios
    const [existingUsers] = await connection.query('SELECT COUNT(*) as count FROM users');
    
    if (existingUsers[0].count > 0) {
      console.log('⚠️  Ya existen usuarios en la base de datos.');
      console.log('   Para resembrar, ejecuta: TRUNCATE TABLE users; manualmente.\n');
      return;
    }
    
    // Insertar usuarios con contraseñas hasheadas
    console.log('🔐 Hasheando contraseñas y creando usuarios...\n');
    
    for (const user of defaultUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      await connection.query(
        `INSERT INTO users (id, name, email, password_hash, role) 
         VALUES (?, ?, ?, ?, ?)`,
        [user.id, user.name, user.email, hashedPassword, user.role]
      );
      
      console.log(`✅ Creado: ${user.name} (${user.email}) → ${user.role}`);
    }
    
    console.log('\n✅ Seed de usuarios completado!');
    console.log('\n📋 Usuarios creados:');
    defaultUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
      console.log(`     Contraseña: ${user.password}`);
      console.log(`     Rol: ${user.role}`);
    });
    
    console.log('\n💡 NOTA: Las contraseñas están hasheadas con bcrypt.');
    console.log('   En producción, usa contraseñas seguras y no las expongas.');
    
  } catch (error) {
    console.error('\n❌ Error durante el seed:', error.message);
    console.error('\n💡 Asegúrate de:');
    console.error('   - La base de datos cine_uvm existe');
    console.error('   - La tabla users existe (ejecuta migrate.js primero)');
    console.error('   - El usuario de MySQL tiene permisos de INSERT');
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

seedUsers();
