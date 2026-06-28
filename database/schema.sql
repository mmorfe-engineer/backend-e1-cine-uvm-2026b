-- ============================================================
--  SISTEMA DE GESTIÓN DE CINE - UVM BACKEND 2026B
--  Trabajo 3 - Autenticación JWT + Roles + Migraciones
--  Autores: Martín Morfe Flores / Martín Alejandro Carballo
-- ============================================================

DROP DATABASE IF EXISTS cine_uvm;
CREATE DATABASE cine_uvm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cine_uvm;

-- ============================================================
-- TABLA USERS (Nueva para Trabajo 3 - Autenticación)
-- ============================================================
CREATE TABLE users (
  id            VARCHAR(36)   NOT NULL,
  name          VARCHAR(255)  NOT NULL,
  email         VARCHAR(255)  NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('admin','staff','viewer') NOT NULL DEFAULT 'viewer',
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_users PRIMARY KEY (id),
  CONSTRAINT uq_user_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE movies (
  id            VARCHAR(36)   NOT NULL,
  title         VARCHAR(255)  NOT NULL,
  genre         VARCHAR(100)  NOT NULL DEFAULT 'Sin clasificar',
  duration      INT           NOT NULL,
  rating        VARCHAR(10)   NOT NULL DEFAULT 'G',
  synopsis      TEXT,
  director      VARCHAR(255),
  release_year  YEAR,
  poster_url    VARCHAR(500),
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_movies    PRIMARY KEY (id),
  CONSTRAINT chk_duration CHECK (duration > 0),
  CONSTRAINT chk_rating   CHECK (rating IN ('G','PG','PG-13','R','NC-17'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rooms (
  id                VARCHAR(36)  NOT NULL,
  name              VARCHAR(100) NOT NULL,
  capacity          INT          NOT NULL,
  type              VARCHAR(50)  NOT NULL DEFAULT 'Regular',
  has_accessibility TINYINT(1)   NOT NULL DEFAULT 0,
  is_active         TINYINT(1)   NOT NULL DEFAULT 1,
  created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_rooms      PRIMARY KEY (id),
  CONSTRAINT uq_room_name  UNIQUE (name),
  CONSTRAINT chk_capacity  CHECK (capacity > 0),
  CONSTRAINT chk_room_type CHECK (type IN ('Regular','IMAX','3D','4DX','VIP'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE functions (
  id               VARCHAR(36)   NOT NULL,
  movie_id         VARCHAR(36)   DEFAULT NULL,
  room_id          VARCHAR(36)   NOT NULL,
  date             DATE          NOT NULL,
  time             TIME          NOT NULL,
  price            DECIMAL(10,2) NOT NULL,
  available_seats  INT           NOT NULL,
  language         VARCHAR(50)   NOT NULL DEFAULT 'Español',
  format           VARCHAR(20)   NOT NULL DEFAULT '2D',
  status           VARCHAR(20)   NOT NULL DEFAULT 'scheduled',
  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_functions   PRIMARY KEY (id),
  CONSTRAINT fk_func_movie  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_func_room   FOREIGN KEY (room_id)  REFERENCES rooms(id)  ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_price      CHECK (price >= 0),
  CONSTRAINT chk_avail      CHECK (available_seats >= 0),
  CONSTRAINT chk_format     CHECK (format IN ('2D','3D','IMAX','4DX')),
  CONSTRAINT chk_f_status   CHECK (status IN ('scheduled','ongoing','finished','cancelled'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tickets (
  id           VARCHAR(36)   NOT NULL,
  function_id  VARCHAR(36)   NOT NULL,
  seat_number  VARCHAR(10)   NOT NULL,
  price        DECIMAL(10,2) NOT NULL,
  status       VARCHAR(20)   NOT NULL DEFAULT 'available',
  holder_name  VARCHAR(255)  DEFAULT NULL,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_tickets        PRIMARY KEY (id),
  CONSTRAINT fk_ticket_func    FOREIGN KEY (function_id) REFERENCES functions(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT uq_ticket_seat    UNIQUE (function_id, seat_number),
  CONSTRAINT chk_ticket_price  CHECK (price >= 0),
  CONSTRAINT chk_ticket_status CHECK (status IN ('available','reserved','sold','cancelled'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reservations (
  id               VARCHAR(36)  NOT NULL,
  ticket_id        VARCHAR(36)  NOT NULL,
  user_id         VARCHAR(36)   NOT NULL,
  user_name        VARCHAR(255) NOT NULL,
  user_email       VARCHAR(255) NOT NULL,
  status           VARCHAR(20)  NOT NULL DEFAULT 'active',
  reservation_date TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes            TEXT         DEFAULT NULL,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_reservations PRIMARY KEY (id),
  CONSTRAINT fk_res_ticket   FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_res_user     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_res_status  CHECK (status IN ('active','cancelled','completed'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INDEXES
CREATE INDEX idx_movies_genre       ON movies (genre);
CREATE INDEX idx_movies_active      ON movies (is_active);
CREATE INDEX idx_func_date          ON functions (date);
CREATE INDEX idx_func_date_time     ON functions (date, time);
CREATE INDEX idx_func_status        ON functions (status);
CREATE INDEX idx_ticket_status      ON tickets (status);
CREATE INDEX idx_ticket_func_status ON tickets (function_id, status);
CREATE INDEX idx_res_email          ON reservations (user_email);
CREATE INDEX idx_res_status         ON reservations (status);
CREATE INDEX idx_res_user          ON reservations (user_id);

-- VISTAS SQL
CREATE VIEW v_functions_full AS
SELECT f.id AS function_id, f.date, f.time, f.price, f.available_seats,
       f.language, f.format, f.status AS function_status,
       m.id AS movie_id, m.title AS movie_title, m.duration AS movie_duration,
       m.genre AS movie_genre, m.rating AS movie_rating,
       r.id AS room_id, r.name AS room_name, r.capacity AS room_capacity, r.type AS room_type
FROM functions f
LEFT JOIN movies m ON f.movie_id = m.id
INNER JOIN rooms r ON f.room_id  = r.id;

CREATE VIEW v_tickets_full AS
SELECT t.id AS ticket_id, t.seat_number, t.price, t.status AS ticket_status, t.holder_name,
       f.id AS function_id, f.date AS function_date, f.time AS function_time,
       m.title AS movie_title, r.name AS room_name
FROM tickets t
INNER JOIN functions f ON t.function_id = f.id
LEFT  JOIN movies   m ON f.movie_id     = m.id
INNER JOIN rooms    r ON f.room_id      = r.id;

CREATE VIEW v_reservations_full AS
SELECT res.id AS reservation_id, res.user_name, res.user_email,
       res.status AS reservation_status, res.reservation_date,
       u.id AS user_id, u.name AS user_name, u.role AS user_role,
       t.id AS ticket_id, t.seat_number, t.price AS ticket_price,
       f.date AS function_date, f.time AS function_time,
       m.title AS movie_title, r.name AS room_name
FROM reservations res
INNER JOIN tickets   t ON res.ticket_id = t.id
INNER JOIN users    u ON res.user_id = u.id
INNER JOIN functions f ON t.function_id = f.id
LEFT  JOIN movies    m ON f.movie_id    = m.id
INNER JOIN rooms     r ON f.room_id     = r.id;

-- SEED DATA
-- Usuarios (Nuevo para Trabajo 3)
-- NOTE: password_hash es generado por bcrypt, estos son placeholders
-- En producción, usar: bcrypt.hashSync('password', 10)
-- ============================================================
INSERT INTO users (id, name, email, password_hash, role) VALUES
('f1e2d3c4-0001-4000-8000-000000000001', 'Admin UVM', 'admin@cine-uvm.edu.ve', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MH9J7D5Q4Ef7J5SAeYt2LxRqZJwL', 'admin'),
('f1e2d3c4-0002-4000-8000-000000000002', 'Martín Morfe', 'mmorfe@cine-uvm.edu.ve', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MH9J7D5Q4Ef7J5SAeYt2LxRqZJwL', 'admin'),
('f1e2d3c4-0003-4000-8000-000000000003', 'Martín Alejandro', 'mcarballo@cine-uvm.edu.ve', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MH9J7D5Q4Ef7J5SAeYt2LxRqZJwL', 'staff'),
('f1e2d3c4-0004-4000-8000-000000000004', 'Taquilla UVM', 'taquilla@cine-uvm.edu.ve', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MH9J7D5Q4Ef7J5SAeYt2LxRqZJwL', 'staff'),
('f1e2d3c4-0005-4000-8000-000000000005', 'Cliente Prueba', 'cliente@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MH9J7D5Q4Ef7J5SAeYt2LxRqZJwL', 'viewer');

INSERT INTO movies (id, title, genre, duration, rating, synopsis, director, release_year) VALUES
('a1b2c3d4-0001-4000-8000-000000000001','Inception','Ciencia Ficción',148,'PG-13','Un ladrón que roba secretos corporativos mediante tecnología de compartir sueños.','Christopher Nolan',2010),
('a1b2c3d4-0002-4000-8000-000000000002','Avengers: Endgame','Acción',181,'PG-13','Los Avengers intentan revertir los daños causados por Thanos.','Anthony Russo',2019),
('a1b2c3d4-0003-4000-8000-000000000003','Interstellar','Ciencia Ficción',169,'PG-13','Exploradores viajan a través de un agujero de gusano en busca de un nuevo hogar.','Christopher Nolan',2014),
('a1b2c3d4-0004-4000-8000-000000000004','The Dark Knight','Acción',152,'PG-13','Batman enfrenta al Joker quien siembra el caos en Gotham City.','Christopher Nolan',2008),
('a1b2c3d4-0005-4000-8000-000000000005','Parasite','Thriller',132,'R','Una familia pobre se infiltra en la vida de una familia adinerada.','Bong Joon-ho',2019);

INSERT INTO rooms (id, name, capacity, type, has_accessibility) VALUES
('b1c2d3e4-0001-4000-8000-000000000001','Sala IMAX Premier',350,'IMAX',1),
('b1c2d3e4-0002-4000-8000-000000000002','Sala 3D Estándar',180,'3D',1),
('b1c2d3e4-0003-4000-8000-000000000003','Sala VIP Gold',60,'VIP',0),
('b1c2d3e4-0004-4000-8000-000000000004','Sala 4DX Experience',120,'4DX',0),
('b1c2d3e4-0005-4000-8000-000000000005','Sala Regular Familiar',220,'Regular',1);

INSERT INTO functions (id, movie_id, room_id, date, time, price, available_seats, language, format, status) VALUES
('c1d2e3f4-0001-4000-8000-000000000001','a1b2c3d4-0001-4000-8000-000000000001','b1c2d3e4-0001-4000-8000-000000000001','2026-06-14','14:00:00',25.50,340,'Español','IMAX','scheduled'),
('c1d2e3f4-0002-4000-8000-000000000002','a1b2c3d4-0002-4000-8000-000000000002','b1c2d3e4-0002-4000-8000-000000000002','2026-06-14','17:30:00',18.00,175,'Español','3D','scheduled'),
('c1d2e3f4-0003-4000-8000-000000000003','a1b2c3d4-0003-4000-8000-000000000003','b1c2d3e4-0003-4000-8000-000000000003','2026-06-15','20:00:00',45.00,55,'Inglés (sub)','2D','scheduled'),
('c1d2e3f4-0004-4000-8000-000000000004','a1b2c3d4-0004-4000-8000-000000000004','b1c2d3e4-0004-4000-8000-000000000004','2026-06-16','16:00:00',30.00,118,'Español','4DX','scheduled'),
('c1d2e3f4-0005-4000-8000-000000000005','a1b2c3d4-0005-4000-8000-000000000005','b1c2d3e4-0005-4000-8000-000000000005','2026-06-17','19:00:00',12.00,215,'Coreano (sub)','2D','scheduled'),
('c1d2e3f4-0006-4000-8000-000000000006','a1b2c3d4-0001-4000-8000-000000000001','b1c2d3e4-0002-4000-8000-000000000002','2026-06-18','21:30:00',18.00,170,'Español','3D','scheduled');

INSERT INTO tickets (id, function_id, seat_number, price, status, holder_name) VALUES
('d1e2f3a4-0001-4000-8000-000000000001','c1d2e3f4-0001-4000-8000-000000000001','A1',25.50,'reserved','Juan Pérez'),
('d1e2f3a4-0002-4000-8000-000000000002','c1d2e3f4-0001-4000-8000-000000000001','A2',25.50,'available',NULL),
('d1e2f3a4-0003-4000-8000-000000000003','c1d2e3f4-0002-4000-8000-000000000002','B5',18.00,'sold','María García'),
('d1e2f3a4-0004-4000-8000-000000000004','c1d2e3f4-0003-4000-8000-000000000003','VIP-1',45.00,'available',NULL),
('d1e2f3a4-0005-4000-8000-000000000005','c1d2e3f4-0004-4000-8000-000000000004','C10',30.00,'available',NULL);

-- Reservations actualizadas con user_id
INSERT INTO reservations (id, ticket_id, user_id, user_name, user_email, status, notes) VALUES
('e1f2a3b4-0001-4000-8000-000000000001','d1e2f3a4-0001-4000-8000-000000000001','f1e2d3c4-0005-4000-8000-000000000005','Juan Pérez','juan.perez@email.com','active','Solicita asiento central'),
('e1f2a3b4-0002-4000-8000-000000000002','d1e2f3a4-0003-4000-8000-000000000003','f1e2d3c4-0003-4000-8000-000000000003','María García','maria.garcia@email.com','completed',NULL);

-- VERIFICATION
SELECT 'users' AS tabla, COUNT(*) AS registros FROM users
UNION ALL SELECT 'movies', COUNT(*) FROM movies
UNION ALL SELECT 'rooms', COUNT(*) FROM rooms
UNION ALL SELECT 'functions', COUNT(*) FROM functions
UNION ALL SELECT 'tickets', COUNT(*) FROM tickets
UNION ALL SELECT 'reservations', COUNT(*) FROM reservations;
