#!/usr/bin/env node
'use strict';

/**
 * Script de Migración para Base de Datos
 * Sistema de Gestión de Cine - UVM Backend 2026B - Trabajo 3
 * 
 * Este script ejecuta el schema.sql para crear toda la estructura de la base de datos
 * desde cero, incluyendo tablas, vistas, índices y datos iniciales.
 * 
 * Uso:
 *   npm run migrate
 * 
 * Requisitos:
 *   - MySQL 8.0+ en ejecución
 *   - Variables de entorno configuradas en .env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuración de conexión a MySQL
const dbConfig = {
  host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306'),
  user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'cine_uvm',
  multipleStatements: true
};

// Ruta al archivo schema.sql
const schemaPath = path.join(__dirname, 'schema.sql');

async function runMigration() {
  let connection;
  
  try {
    console.log('🔄 Iniciando migración de base de datos...\n');
    
    // Leer el archivo schema.sql
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`❌ Archivo schema.sql no encontrado en ${schemaPath}`);
    }
    
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Archivo schema.sql cargado\n');
    
    // Crear conexión
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    console.log(`🔗 Conectado a MySQL en ${dbConfig.host}:${dbConfig.port}\n`);
    
    // Ejecutar el schema completo
    console.log('📦 Ejecutando schema.sql...');
    await connection.query(schemaSQL);
    console.log('✅ Schema ejecutado correctamente\n');
    
    // Verificar tablas creadas
    console.log('🔍 Verificando tablas...');
    const [tables] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = ? 
       ORDER BY TABLE_NAME`,
      [dbConfig.database]
    );
    
    console.log('\n📋 Tablas creadas:');
    tables.forEach(table => {
      console.log(`   - ${table.TABLE_NAME}`);
    });
    
    // Verificar usuarios de prueba
    console.log('\n👥 Usuarios de prueba:');
    const [users] = await connection.query(
      'SELECT id, name, email, role FROM users LIMIT 5'
    );
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) → ${user.role}`);
    });
    
    console.log('\n✅ Migración completada con éxito!');
    console.log('\n💡 Para usar el sistema:');
    console.log('   1. Configura tu archivo .env con las credenciales de MySQL');
    console.log('   2. Ejecuta npm start para iniciar el servidor');
    console.log('   3. Los usuarios de prueba son:');
    console.log('      - admin@cine-uvm.edu.ve / password: admin123');
    console.log('      - mmorfe@cine-uvm.edu.ve / password: admin123');
    console.log('      - mcarballo@cine-uvm.edu.ve / password: staff123');
    
  } catch (error) {
    console.error('\n❌ Error durante la migración:', error.message);
    console.error('\n💡 Posibles soluciones:');
    console.error('   - Verifica que MySQL esté en ejecución');
    console.error('   - Verifica las credenciales en tu archivo .env');
    console.error('   - Verifica que el usuario tenga permisos para crear la base de datos');
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

runMigration();
