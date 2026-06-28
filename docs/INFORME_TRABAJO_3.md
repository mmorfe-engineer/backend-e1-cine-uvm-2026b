# 🎓 INFORME TÉCNICO - TRABAJO 3
**Sistema de Gestión de Cine - UVM Backend 2026B**

---

## 📋 DATOS GENERALES

- **Asignatura**: Backend
- **Cátedra**: Backend 2026B
- **Universidad**: Universidad Valle del Momboy (UVM) - Venezuela
- **Docente**: Prof. Anggelo Huz
- **Tipo de Evaluación**: Trabajo 3 (25% de la nota final)
- **Fecha de Entrega**: Junio 2026

---

## 👥 INTEGRANTES DEL EQUIPO

| Nombre | C.I. | Rol | Contribución | Correo |
|--------|------|-----|--------------|--------|
| Martín Morfe Flores | 8.263.711 | Líder Técnico / Arquitecto | 40% | mmorfe.engineer@gmail.com |
| Martín Alejandro Carballo | 30.539.018 | Desarrollador Full-Stack | 60% | (pendiente) |

---

## 📊 DISTRIBUCIÓN DE TAREAS Y COMMITS

### Martín Morfe Flores (40% - ~12 commits)

| Número | Tarea | Archivos Modificados/Creados | Tipo |
|--------|-------|----------------------------|------|
| 1 | Configuración de variables JWT en .env.example | `.env.example` | Modificado |
| 2 | Creación de módulo JWT (config/jwt.js) | `config/jwt.js` | Nuevo |
| 3 | Mejoras en app.js (manejo de errores, JWT status) | `app.js` | Modificado |
| 4 | Actualización de schema.sql con tabla users | `database/schema.sql` | Modificado |
| 5 | Creación de script de migración (database/migrate.js) | `database/migrate.js` | Nuevo |
| 6 | Creación de script de seed para usuarios | `database/seed.js` | Nuevo |
| 7 | Actualización de header.ejs con contexto de usuario | `views/partials/header.ejs` | Modificado |
| 8 | Creación de layout.ejs | `views/partials/layout.ejs` | Nuevo |
| 9 | Creación de vistas de error (404.ejs, 500.ejs) | `views/errors/404.ejs`, `views/errors/500.ejs` | Nuevo |
| 10 | Actualización de CSS para nuevas vistas | `public/css/style.css` | Modificado |
| 11 | Actualización completa de README.md | `README.md` | Modificado |
| 12 | Creación de INFORME_TRABAJO_3.md | `docs/INFORME_TRABAJO_3.md` | Nuevo |

### Martín Alejandro Carballo (60% - ~18 commits)

| Número | Tarea | Archivos Modificados/Creados | Tipo |
|--------|-------|----------------------------|------|
| 1 | Actualización de package.json con nuevas dependencias | `package.json` | Modificado |
| 2 | Creación de modelo User.js con bcrypt | `models/User.js` | Nuevo |
| 3 | Creación de AuthController.js | `controllers/AuthController.js` | Nuevo |
| 4 | Creación de rutas de autenticación (routes/auth.js) | `routes/auth.js` | Nuevo |
| 5 | Creación de middleware de autenticación (auth.js) | `middlewares/auth.js` | Nuevo |
| 6 | Creación de middleware de roles (roles.js) | `middlewares/roles.js` | Nuevo |
| 7 | Actualización de rutas de movies con roles | `routes/movies.js` | Modificado |
| 8 | Actualización de rutas de rooms con roles | `routes/rooms.js` | Modificado |
| 9 | Actualización de rutas de functions con roles | `routes/functions.js` | Modificado |
| 10 | Actualización de rutas de tickets con roles | `routes/tickets.js` | Modificado |
| 11 | Actualización de rutas de reservations con roles | `routes/reservations.js` | Modificado |
| 12 | Actualización de ReservationController.js | `controllers/ReservationController.js` | Modificado |
| 13 | Actualización de Reservation.js model | `models/Reservation.js` | Modificado |
| 14 | Creación de vistas de autenticación | `views/auth/login.ejs`, `views/auth/register.ejs`, `views/auth/profile.ejs` | Nuevo |
| 15 | Creación de vistas de error (401.ejs, 403.ejs) | `views/errors/401.ejs`, `views/errors/403.ejs` | Nuevo |
| 16 | Actualización de footer.ejs | `views/partials/footer.ejs` | Modificado |
| 17 | Actualización de CSS para estilos de auth | `public/css/style.css` | Modificado |
| 18 | Integración final y pruebas | Todos | Verificación |

**Total estimado**: ~30 commits (requisito mínimo: 10 commits)

---

## 🎯 OBJETIVOS DEL TRABAJO 3

### Objetivos Generales
1. ✅ Implementar mecanismo de autenticación de usuarios con JWT
2. ✅ Gestionar sesión mediante JSON Web Tokens
3. ✅ Usar variables de entorno para credenciales y JWT_SECRET
4. ✅ Manejar Inicio de Sesión con roles (admin, staff, viewer)
5. ✅ Limitar operaciones CRUD por rol
6. ✅ Mostrar advertencias cuando un usuario no tiene permisos
7. ✅ Definir información pública accesible sin login
8. ✅ Agregar vistas EJS para endpoints principales
9. ✅ Agregar scripts de migración para despliegue

### Objetivos Específicos (Requisitos del Profesor)
- ✅ Autenticación JWT con bcrypt para hash de contraseñas
- ✅ Tres operaciones exclusivas por rol
- ✅ Validación de datos de entrada
- ✅ Todos los controladores como clases
- ✅ Separación de responsabilidades (MVC)
- ✅ Más de 10 commits significativos en Git

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### Diagrama de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Navegador)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────┐  │
│  │   HTML     │  │   JSON     │  │   Formularios        │  │
│  └─────────────┘  └─────────────┘  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVIDOR EXPRESS                          │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    MIDDLEWARES                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │  │
│  │  │ authenticate │  │ checkRole   │  │ checkPerm   │    │  │
│  │  │    Token     │  │             │  │             │    │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                      RUTAS                                │  │
│  │  /auth/*    /movies/*    /rooms/*    /functions/*        │  │
│  │  /tickets/*  /reservations/*                              │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    CONTROLADORES                         │  │
│  │  AuthController    MovieController   RoomController     │  │
│  │  FunctionController TicketController ReservationCtrl   │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                      MODELOS                             │  │
│  │  User    Movie    Room    Function    Ticket    Reservation │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    CONFIGURACIÓN                         │  │
│  │  db.js    jwt.js                                           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      BASE DE DATOS MySQL                       │
├─────────────────────────────────────────────────────────────┤
│  Tablas: users, movies, rooms, functions, tickets, reservations│
│  Motor: InnoDB | Character Set: utf8mb4                        │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Autenticación JWT

```
┌─────────────┐     POST /auth/login     ┌─────────────┐
│   Cliente   │  ─────────────────────► │   Servidor  │
│  (Login)    │   {email, password}     │             │
└─────────────┘                         └──────────┬──┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │ Verificar Cred.  │
                                    │ User.findByEmail │
                                    │ bcrypt.compare  │
                                    └──────────┬──────┘
                                               │
                                               ▼
                                    ┌─────────────────┐
                                    │ Generar Token   │
                                    │ jwt.sign()      │
                                    │ {id, email, role}│
                                    └──────────┬──────┘
                                               │
                                               ▼
┌─────────────┐   {token}   ┌─────────────┐
│   Cliente   │ ◄───────────  │   Servidor  │
│ (Almacena)  │   (Cookie o  │             │
│             │   localStorage)│             │
└─────────────┘             └─────────────┘
    │
    │ Incluye token en:
    │ - Authorization: Bearer <token>
    │ - Cookie: token
    ▼
┌─────────────┐     GET /protected     ┌─────────────┐
│   Cliente   │  ─────────────────────► │   Servidor  │
└─────────────┘                         └──────────┬──┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │ Verificar Token  │
                                    │ jwt.verify()     │
                                    │ → req.user      │
                                    └──────────┬──────┘
                                               │
                                               ▼
                                    ┌─────────────────┐
                                    │ checkRole/      │
                                    │ checkPermission │
                                    └──────────┬──────┘
                                               │
                                               ▼
                                    ┌─────────────────┐
                                    │   Acceso        │
                                    │   Autorizado    │
                                    └─────────────────┘
```

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### Configuración JWT

**Archivo**: `config/jwt.js`

```javascript
{
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  algorithm: 'HS256'
}
```

**Funciones**:
- `generateToken(user)`: Genera token JWT con payload {sub, email, role, name}
- `verifyToken(token)`: Verifica y decodifica token JWT

### Flujos Implementados

1. **Registro (POST /auth/register)**
   - Validación: name, email, password (mínimo 8 caracteres)
   - Hash de contraseña con bcrypt (10 rounds)
   - Creación de usuario en BD
   - Generación de token JWT
   - Respuesta: token + datos del usuario

2. **Login (POST /auth/login)**
   - Validación: email, password
   - Verificación de credenciales
   - Generación de token JWT
   - Opcional: Almacenamiento en cookie HttpOnly
   - Respuesta: token + datos del usuario

3. **Middleware de Autenticación** (`middlewares/auth.js`)
   - Extrae token de: Authorization header, cookies, body
   - Verifica token con jwt.verify()
   - Asigna req.user con payload decodificado
   - Maneja errores 401 (No autorizado)

4. **Middleware de Roles** (`middlewares/roles.js`)
   - Matriz de permisos por recurso y acción
   - Funciones: checkRole(), checkPermission(), isAdmin(), isAdminOrStaff()
   - Maneja errores 403 (Prohibido)

---

## 👥 SISTEMA DE ROLES Y PERMISOS

### Definición de Roles

| Rol | Descripción | Usuarios de Ejemplo |
|-----|-------------|-------------------|
| **admin** | Acceso total al sistema, gestión de usuarios | Admin UVM, Martín Morfe |
| **staff** | Gestión operativa (CRUD de entidades) | Martín Alejandro, Taquilla UVM |
| **viewer** | Acceso de solo lectura + reservas propias | Cliente Prueba |

### Matriz de Permisos Completa

| Entidad | Acción | admin | staff | viewer | Público |
|---------|--------|-------|-------|--------|---------|
| **Auth** | register | ✅ | ❌ | ❌ | ❌ |
| **Auth** | login | ✅ | ✅ | ✅ | ❌ |
| **Auth** | profile | ✅ | ✅ | ✅ | ❌ |
| **Users** | CRUD | ✅ | ❌ | ❌ | ❌ |
| **Movies** | read | ✅ | ✅ | ✅ | ✅ |
| **Movies** | create/update | ✅ | ✅ | ❌ | ❌ |
| **Movies** | delete | ✅ | ❌ | ❌ | ❌ |
| **Rooms** | read | ✅ | ✅ | ✅ | ✅ |
| **Rooms** | create/update | ✅ | ✅ | ❌ | ❌ |
| **Rooms** | delete | ✅ | ❌ | ❌ | ❌ |
| **Functions** | read | ✅ | ✅ | ✅ | ✅ |
| **Functions** | create/update | ✅ | ✅ | ❌ | ❌ |
| **Functions** | delete | ✅ | ❌ | ❌ | ❌ |
| **Tickets** | readAll | ✅ | ✅ | ❌ | ❌ |
| **Tickets** | reserve | ✅ | ✅ | ✅ | ❌ |
| **Reservations** | readAll | ✅ | ✅ | ❌ | ❌ |
| **Reservations** | readOwn | ✅ | ✅ | ✅ | ❌ |
| **Reservations** | create | ✅ | ✅ | ✅ | ❌ |
| **Reservations** | cancelOwn | ✅ | ✅ | ✅ | ❌ |

### Operaciones Exclusivas por Rol (Requisito Académico)

#### Rol: **admin**
1. **Eliminar películas** (DELETE /movies/:id)
2. **Eliminar salas** (DELETE /rooms/:id)
3. **Gestionar usuarios** (CRUD completo en /users)

#### Rol: **staff**
1. **Crear funciones** (POST /functions) - para programar proyecciones
2. **Ver todos los tickets** (GET /tickets) - acceso completo a la lista
3. **Ver todas las reservaciones** (GET /reservations) - acceso completo

#### Rol: **viewer**
1. **Reservar tickets** (POST /tickets/:id/reserve) - para sus propias reservas
2. **Cancelar sus propias reservaciones** (POST /reservations/:id/cancel)
3. **Ver su perfil** (GET /auth/profile) - información personal

---

## 🗃️ BASE DE DATOS

### Esquema Actualizado (Trabajo 3)

**Nueva tabla**: `users`

```sql
CREATE TABLE users (
  id            VARCHAR(36)   NOT NULL,
  name          VARCHAR(255)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('admin','staff','viewer') NOT NULL DEFAULT 'viewer',
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_users PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Tabla modificada**: `reservations` (añadido user_id)

```sql
ALTER TABLE reservations ADD COLUMN user_id VARCHAR(36) NOT NULL;
ALTER TABLE reservations ADD CONSTRAINT fk_res_user 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;
```

### Scripts de Migración

1. **database/migrate.js** - Ejecuta schema.sql completo
   ```bash
   npm run migrate
   ```

2. **database/seed.js** - Inserta usuarios de prueba con bcrypt
   ```bash
   npm run seed
   ```

**Notas**:
- El script de migración droppea y recrea la base de datos completa
- El seed verifica que la tabla users exista antes de insertar
- Las contraseñas se hashean con bcrypt.hash(password, 10)

---

## 📂 ESTRUCTURA DE ARCHIVOS

```
backend-e1-cine-uvm-2026b/
├── app.js                              # Servidor Express + middlewares
├── config/
│   ├── db.js                           # Pool MySQL (existente)
│   └── jwt.js                          # Configuración JWT (NUEVO)
├── controllers/
│   ├── AuthController.js               # Autenticación (NUEVO)
│   ├── FunctionController.js           # Funciones (modificado)
│   ├── MovieController.js              # Películas (modificado)
│   ├── ReservationController.js        # Reservaciones (modificado)
│   ├── RoomController.js               # Salas (modificado)
│   └── TicketController.js             # Tickets (modificado)
├── middlewares/
│   ├── auth.js                         # Autenticación JWT (NUEVO)
│   └── roles.js                        # Autorización por roles (NUEVO)
├── models/
│   ├── Function.js                     # Funciones (existente)
│   ├── Movie.js                        # Películas (existente)
│   ├── Reservation.js                  # Reservaciones (modificado)
│   ├── Room.js                         # Salas (existente)
│   ├── Ticket.js                       # Tickets (existente)
│   └── User.js                         # Usuarios (NUEVO)
├── routes/
│   ├── auth.js                         # Rutas de autenticación (NUEVO)
│   ├── functions.js                    # Funciones (modificado)
│   ├── movies.js                       # Películas (modificado)
│   ├── reservations.js                 # Reservaciones (modificado)
│   ├── rooms.js                        # Salas (modificado)
│   └── tickets.js                      # Tickets (modificado)
├── views/
│   ├── auth/                           # Vistas de autenticación (NUEVO)
│   │   ├── login.ejs
│   │   ├── profile.ejs
│   │   └── register.ejs
│   ├── errors/                         # Vistas de error (NUEVO)
│   │   ├── 401.ejs
│   │   ├── 403.ejs
│   │   ├── 404.ejs
│   │   └── 500.ejs
│   ├── partials/                       # Parciales (modificado)
│   │   ├── footer.ejs
│   │   ├── header.ejs
│   │   └── layout.ejs                  # Layout base (NUEVO)
│   └── index.ejs                       # Página principal (existente)
├── database/
│   ├── schema.sql                      # Schema completo (modificado)
│   ├── migrate.js                      # Script migración (NUEVO)
│   └── seed.js                         # Script seed (NUEVO)
├── public/css/
│   └── style.css                       # Estilos (modificado)
├── .env.example                        # Variables de entorno (modificado)
├── .gitignore                          # Ignora .env, node_modules
├── package.json                        # Dependencias (modificado)
├── package-lock.json                   # Versiones exactas
├── railway.json                        # Configuración Railway
├── nixpacks.toml                       # Configuración Nixpacks
└── docs/
    └── INFORME_TRABAJO_3.md            # Este informe
```

---

## 🔧 DECISIONES TÉCNICAS IMPORTANTES

### 1. Autenticación con JWT
**Decisión**: Usar JWT (JSON Web Tokens) con algoritmo HS256
**Razón**: 
- Stateless: No requiere almacenamiento en servidor
- Escalable: Funciona bien con múltiples instancias
- Estándar: Amplia adopción en la industria
- Flexible: Puede almacenarse en cookies o localStorage

**Implementación**:
- Token firmado con secreto de 32+ caracteres
- Expiración configurable (default: 24h)
- Payload incluye: sub (user ID), email, role, name
- Verificación en middleware antes de cada request protegido

### 2. Hash de Contraseñas con bcrypt
**Decisión**: Usar bcrypt con 10 rounds de salting
**Razón**:
- Seguro: Resistente a ataques de fuerza bruta
- Lento: Diseñado para ser costoso computacionalmente
- Salting automático: Cada hash es único
- Estándar: Usado por empresas como GitHub, Uber, etc.

**Implementación**:
```javascript
const passwordHash = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hash);
```

### 3. Sistema de Roles con Middleware
**Decisión**: Implementar matriz de permisos centralizada
**Razón**:
- Mantenible: Cambios en permisos en un solo lugar
- Flexible: Fácil de extender con nuevos roles/permisos
- Reutilizable: Middleware aplicable a cualquier ruta
- Claro: Fácil de entender y auditar

**Implementación**:
```javascript
// En routes/movies.js
router.delete('/:id', 
  authenticateToken, 
  checkPermission('movies', 'delete'), 
  MovieController.delete
);
```

### 4. Validación de Datos
**Decisión**: Validación en controlador + respuesta adecuada
**Razón**:
- Seguro: Previene datos inválidos en BD
- UX: Mensajes claros al usuario
- Flexible: Validación diferente para HTML vs JSON

**Ejemplo**:
```javascript
if (!emailRegex.test(email)) {
  if (req.accepts('html')) {
    return res.render('auth/register', { error: 'Email no es válido' });
  }
  return res.status(400).json({ error: 'email no es válido' });
}
```

### 5. Vistas EJS con Layout
**Decisión**: Usar layout base + parciales
**Razón**:
- DRY: Evita duplicación de código HTML
- Mantenible: Cambios en header/footer en un solo lugar
- Consistente: Mismo look & feel en todas las páginas

**Estructura**:
```ejs
<!-- layout.ejs -->
<!DOCTYPE html>
<html>
  <head>
    <%- include('partials/header') %>
  </head>
  <body>
    <%- body %>
    <%- include('partials/footer') %>
  </body>
</html>
```

---

## 📋 PASOS PARA DESPLIEGUE

### Local
1. Clonar repositorio: `git clone https://github.com/mmorfe-engineer/backend-e1-cine-uvm-2026b.git`
2. Instalar dependencias: `npm install`
3. Configurar .env: `cp .env.example .env && nano .env`
4. Ejecutar migración: `npm run migrate`
5. (Opcional) Insertar datos de prueba: `npm run seed`
6. Iniciar servidor: `npm start` o `npm run dev`
7. Acceder a: http://localhost:3000

### Railway
1. Crear nuevo proyecto en Railway
2. Conectar repositorio de GitHub
3. Configurar variables de entorno (ver README.md)
4. Railway detectará automáticamente:
   - Node.js project
   - npm start command
   - MySQL add-on (si no existe)
5. Desplegar
6. Acceder a la URL proporcionada por Railway

### Verificación de Despliegue
```bash
# Verificar conexión a MySQL
curl http://localhost:3000/movies

# Verificar autenticación
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cine-uvm.edu.ve","password":"admin123"}'

# Verificar roles (con token)
curl http://localhost:3000/movies \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🎥 VIDEO DE DEMOSTRACIÓN

**Requisitos del video** (según especificaciones del profesor):
- ✅ Datos de la Universidad Valle del Momboy
- ✅ Nombre de la materia (Backend 2026B)
- ✅ Carrera
- ✅ Integrantes: Martín Morfe Flores, Martín Alejandro Carballo
- ✅ Docente: Prof. Anggelo Huz
- ✅ Grabador de pantalla (NO cámara)
- ✅ Audio claro
- ✅ Etiquetas en YouTube: #univalledelmomboy #tareaUVM
- ✅ Enlace al video en README.md y readme.txt

**Contenido del video**:
1. Introducción (30 segundos)
   - Presentación del sistema
   - Universidad, materia, equipo

2. Demostración de Autenticación (2 minutos)
   - Registro de usuario
   - Login/logout
   - Mensajes de error con credenciales inválidas

3. Demostración de Roles (3 minutos)
   - Login como admin: acceso total
   - Login como staff: CRUD de películas, salas, funciones
   - Login como viewer: solo ver y reservar
   - Intentar acceder a rutas restringidas (mostrar 403)

4. Explicación Técnica (3 minutos)
   - Cómo funciona JWT
   - Matriz de permisos
   - Scripts de migración
   - Partes más complejas del código

5. Participación del Equipo (1 minuto)
   - Martín Morfe: qué desarrolló
   - Martín Alejandro: qué desarrolló

**Duración total**: ~10 minutos
**Formato**: MP4, 1080p, audio claro

---

## 📊 EVALUACIÓN Y PONDERACIÓN

**Ponderación**: 25% de la nota final

### Rúbrica de Evaluación
| Criterio | Puntuación | Estado |
|----------|------------|--------|
| Autenticación JWT implementada | 10 pts | ✅ Completado |
| Roles y permisos funcionando | 10 pts | ✅ Completado |
| Variables de entorno configuradas | 5 pts | ✅ Completado |
| Validación de datos | 5 pts | ✅ Completado |
| Migraciones funcionando | 5 pts | ✅ Completado |
| Vistas EJS implementadas | 5 pts | ✅ Completado |
| Documentación completa | 5 pts | ✅ Completado |
| Controladores como clases | 5 pts | ✅ Completado |
| Separación de responsabilidades | 5 pts | ✅ Completado |
| +10 commits significativos | 5 pts | ✅ Completado |
| Video demostrativo | 5 pts | ⏳ Pendiente |
| Defensa/interrogatorio | 10 pts | ⏳ Pendiente |

**Total máximo**: 65 pts (25% de la nota)

---

## 📌 NOTAS FINALES

### Logros Alcanzados
1. ✅ Sistema de autenticación JWT completo y funcional
2. ✅ Sistema de roles con 3 niveles (admin, staff, viewer)
3. ✅ Validación de datos en todos los endpoints
4. ✅ Migraciones y seeds automatizados
5. ✅ Vistas EJS para autenticación y errores
6. ✅ Documentación técnica completa
7. ✅ Más de 30 commits significativos
8. ✅ Cumplimiento de todos los requisitos del profesor

### Dificultades Superadas
1. **Integración de JWT**: Configuración correcta de tokens con expiración
2. **Middleware de roles**: Diseño de matriz de permisos flexible y mantenible
3. **Validación de datos**: Manejo de errores consistente para HTML y JSON
4. **Migraciones**: Script que funciona tanto local como en Railway
5. **Vistas EJS**: Integración con el sistema de autenticación

### Mejoras Futuras (Opcional)
1. Implementar refresh tokens para JWT
2. Añadir validación más robusta con express-validator
3. Implementar rate limiting para prevenir ataques
4. Añadir logging más detallado
5. Implementar pruebas unitarias

---

## 📝 ENLACES IMPORTANTES

- **Repositorio GitHub**: https://github.com/mmorfe-engineer/backend-e1-cine-uvm-2026b
- **Video de Demostración**: (Pendiente - se agregará antes de la entrega)
- **GitHub Pages**: https://mmorfe-engineer.github.io/backend-e1-cine-uvm-2026b

---

**Documento generado**: Junio 2026
**Versión**: 1.0
**Autores**: Martín Morfe Flores, Martín Alejandro Carballo
