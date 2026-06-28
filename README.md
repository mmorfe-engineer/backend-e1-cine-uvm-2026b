# 🎬 Sistema de Gestión de Cine - Backend REST API

**Universidad Valle del Momboy (UVM) | Cátedra Backend 2026B | Trabajo 3 - Autenticación JWT + Roles + Migraciones**

---

## 📋 Información del Proyecto

- **Título**: Sistema de Gestión de Cine - UVM Backend 2026B
- **Versión**: 3.0.0
- **Evaluación**: Trabajo 3 - Autenticación, Roles y Migraciones
- **Autores**:
  - Martín Morfe Flores (C.I. 8.263.711) - Arquitectura, Base de Datos, Migraciones, Configuración
  - Martín Alejandro Carballo (C.I. 30.539.018) - Autenticación, Controladores, Middlewares, Vistas
- **Repositorio**: https://github.com/mmorfe-engineer/backend-e1-cine-uvm-2026b
- **Deploy**: Railway.app (MySQL Cloud + Node.js)

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Node.js** | v14+ | Runtime |
| **Express.js** | 4.18.2 | Framework web |
| **MySQL** | 8.0 | Base de datos |
| **mysql2/promise** | 3.6.5 | Driver MySQL |
| **dotenv** | 16.0.0 | Variables de entorno |
| **uuid** | 9.0.0 | IDs únicos |
| **EJS** | 3.1.9 | Motor de plantillas |
| **bcrypt** | 5.1.1 | Hash de contraseñas |
| **jsonwebtoken** | 9.0.2 | Autenticación JWT |
| **cookie-parser** | 1.4.6 | Manejo de cookies |
| **method-override** | 3.0.0 | Métodos HTTP |
| **nodemon** | 3.0.2 | Auto-reload (dev) |

**Arquitectura**: MVC (Model-View-Controller) + Separación de Responsabilidades + Middlewares

---

## 🎯 Características Principales (Trabajo 3)

✅ **Autenticación JWT** - Sistema de login con tokens seguros
✅ **Gestión de Roles** - admin, staff, viewer con permisos diferenciados
✅ **Hash de Contraseñas** - bcrypt con 10 rounds de salting
✅ **Migraciones** - Scripts para crear BD desde cero
✅ **Vistas EJS** - Interfaz completa para autenticación y errores
✅ **Validación de Datos** - Formularios y API con validación estricta
✅ **Variables de Entorno** - Configuración segura con .env

---

## 📦 Instalación y Ejecución

### 1. Pre-requisitos
- Node.js v14+
- MySQL 8.0+
- git
- npm

### 2. Clonar el repositorio
```bash
git clone https://github.com/mmorfe-engineer/backend-e1-cine-uvm-2026b.git
cd backend-e1-cine-uvm-2026b
```

### 3. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales de MySQL
nano .env
```

**Variables requeridas en .env**:
```bash
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=cine_uvm
NODE_ENV=development

# JWT Configuration (Trabajo 3)
JWT_SECRET=tu_secreto_seguro_minimo_32_caracteres
JWT_EXPIRES_IN=24h
```

> ⚠️ **IMPORTANTE**: El archivo `.env` **NO** debe subirse a GitHub. Ya está en `.gitignore`.

### 4. Instalar dependencias
```bash
npm install
```

### 5. Ejecutar migración de base de datos
```bash
npm run migrate
```

### 6. Insertar usuarios de prueba (opcional)
```bash
npm run seed
```

### 7. Iniciar el servidor
```bash
npm start      # Producción
npm run dev   # Desarrollo (con nodemon)
```

---

## 🔐 Autenticación y Roles

### Usuarios de Prueba (después de npm run seed)
| Email | Contraseña | Rol |
|-------|-------------|-----|
| admin@cine-uvm.edu.ve | admin123 | admin |
| mmorfe@cine-uvm.edu.ve | admin123 | admin |
| mcarballo@cine-uvm.edu.ve | staff123 | staff |
| taquilla@cine-uvm.edu.ve | staff123 | staff |
| cliente@test.com | viewer123 | viewer |

### Matriz de Permisos
| Recurso | Acción | admin | staff | viewer |
|---------|--------|-------|-------|--------|
| **Películas** | Listar | ✅ | ✅ | ✅ |
| **Películas** | Crear/Editar | ✅ | ✅ | ❌ |
| **Películas** | Eliminar | ✅ | ❌ | ❌ |
| **Salas** | Listar | ✅ | ✅ | ✅ |
| **Salas** | Crear/Editar | ✅ | ✅ | ❌ |
| **Salas** | Eliminar | ✅ | ❌ | ❌ |
| **Funciones** | Listar | ✅ | ✅ | ✅ |
| **Funciones** | Crear/Editar | ✅ | ✅ | ❌ |
| **Funciones** | Eliminar | ✅ | ❌ | ❌ |
| **Tickets** | Reservar | ✅ | ✅ | ✅ |
| **Reservaciones** | Crear/Cancelar (propias) | ✅ | ✅ | ✅ |
| **Usuarios** | Gestionar | ✅ | ❌ | ❌ |

---

## 🏗️ Arquitectura

```
backend-e1-cine-uvm-2026b/
├── app.js
├── config/
│   ├── db.js
│   └── jwt.js
├── controllers/
│   ├── AuthController.js
│   ├── FunctionController.js
│   ├── MovieController.js
│   ├── ReservationController.js
│   ├── RoomController.js
│   └── TicketController.js
├── middlewares/
│   ├── auth.js
│   └── roles.js
├── models/
│   ├── Function.js
│   ├── Movie.js
│   ├── Reservation.js
│   ├── Room.js
│   ├── Ticket.js
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── functions.js
│   ├── movies.js
│   ├── reservations.js
│   ├── rooms.js
│   └── tickets.js
├── views/
│   ├── auth/
│   │   ├── login.ejs
│   │   ├── profile.ejs
│   │   └── register.ejs
│   ├── errors/
│   │   ├── 401.ejs
│   │   ├── 403.ejs
│   │   ├── 404.ejs
│   │   └── 500.ejs
│   ├── partials/
│   │   ├── footer.ejs
│   │   ├── header.ejs
│   │   └── layout.ejs
│   └── index.ejs
├── database/
│   ├── schema.sql
│   ├── migrate.js
│   └── seed.js
├── public/css/
│   └── style.css
├── .env.example
├── package.json
└── README.md
```

---

## 👨‍💻 Equipo

- **Martín Morfe Flores**: Arquitectura, MySQL, Configuración, Migraciones, Documentación
- **Martín Alejandro Carballo**: Autenticación, Middlewares, Controladores, Vistas

---

**Última actualización**: Junio 2026
