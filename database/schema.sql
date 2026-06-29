-- ============================================================
-- SISTEMA DE GESTION DE CINE - UVM BACKEND 2026B
-- Trabajo 3 - Autenticacion JWT + Roles + Migraciones
-- Autores: Martin Morfe Flores / Martin Alejandro Carballo
-- ============================================================

DROP DATABASE IF EXISTS cine_uvm;
CREATE DATABASE cine_uvm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cine_uvm;

-- ============================================================
-- TABLA USERS
-- ============================================================
CREATE TABLE users (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff', 'viewer') NOT NULL DEFAULT 'viewer',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA MOVIES
-- ============================================================
CREATE TABLE movies (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL,
  release_date DATE,
  genre VARCHAR(100),
  director VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA ROOMS
-- ============================================================
CREATE TABLE rooms (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  capacity INT NOT NULL,
  screen_type ENUM('2D', '3D', 'IMAX') DEFAULT '2D',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA FUNCTIONS
-- ============================================================
CREATE TABLE functions (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  movie_id VARCHAR(36) NOT NULL,
  room_id VARCHAR(36) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLA TICKETS
-- ============================================================
CREATE TABLE tickets (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  function_id VARCHAR(36) NOT NULL,
  seat_number VARCHAR(10) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_reserved TINYINT(1) DEFAULT 0,
  FOREIGN KEY (function_id) REFERENCES functions(id) ON DELETE CASCADE,
  UNIQUE KEY (function_id, seat_number)
);

-- ============================================================
-- TABLA RESERVATIONS
-- ============================================================
CREATE TABLE reservations (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  ticket_id VARCHAR(36) NOT NULL,
  reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);
