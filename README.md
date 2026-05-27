# 🎬 Sistema de Gestión de Cine - Backend REST API

**Universidad Valle del Momboy (UVM) | Cátedra Backend 2026B | Caracas, Venezuela**

---

## 📋 Información del Proyecto

- **Título**: Sistema de Gestión de Cine
- **Trimestre**: 2026-B
- **Autores**: 
  - Martín Morfe (C.I. 8263711)
  - Martín Alejandro Carballo (C.I. 30539018)

---

## 🛠️ Tecnologías Utilizadas

- **Node.js** (v14+)
- **Express.js** (v4.18.2)
- **UUID v4** (RFC 4122)
- **EJS** (Embedded JavaScript Templates)
- **CommonJS** (require/module.exports)

---

## 📦 Instalación

### 1. Clonar o descargar el proyecto

```bash
git clone https://github.com/mmorfe-engineer/backend-e1-cine-uvm-2026b.git
cd backend-cine-uvm-final
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar el servidor

```bash
npm start
```

**Resultado esperado:**
```
✅ Servidor corriendo en http://localhost:3000
🎬 Dashboard: http://localhost:3000
📡 API REST disponible en todos los endpoints
```

---

## 📚 ENDPOINTS DISPONIBLES

### 🎬 PELÍCULAS (Movies)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/movies` | Listar todas las películas |
| GET | `/movies/:id` | Obtener película por ID |
| POST | `/movies` | Crear nueva película |
| PUT | `/movies/:id` | Actualizar película |
| DELETE | `/movies/:id` | Eliminar película |

**Ejemplo de POST /movies:**
```json
{
  "title": "Inception",
  "duration": 148
}
```

---

### 🎞️ FUNCIONES (Proyecciones)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/functions` | Listar todas las funciones |
| GET | `/functions/last5` | Últimas 5 funciones (descendente) |
| GET | `/functions/range?start=YYYY-MM-DD&end=YYYY-MM-DD` | Funciones por rango de fechas |
| GET | `/functions/:id` | Obtener función por ID |
| POST | `/functions` | Crear nueva función |
| PUT | `/functions/:id` | Actualizar función |
| DELETE | `/functions/:id` | Eliminar función |

**Ejemplo de POST /functions:**
```json
{
  "movieId": "uuid-aqui",
  "roomId": "sala_1",
  "date": "2026-06-01",
  "time": "19:30"
}
```

---

### 🎫 TICKETS (Entradas)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/tickets` | Listar todos los tickets |
| GET | `/tickets/:functionId` | Tickets de una función |
| POST | `/tickets` | Crear nuevo ticket |
| POST | `/tickets/:id/reserve` | Reservar un ticket |
| PUT | `/tickets/:id` | Actualizar ticket |
| DELETE | `/tickets/:id` | Eliminar ticket |

**Ejemplo de POST /tickets:**
```json
{
  "functionId": "uuid-aqui",
  "seatNumber": "A1",
  "price": 250.00
}
```

---

### 🚪 SALAS (Rooms)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/rooms` | Listar todas las salas |
| GET | `/rooms/:id` | Obtener sala por ID |
| POST | `/rooms` | Crear nueva sala |
| PUT | `/rooms/:id` | Actualizar sala |
| DELETE | `/rooms/:id` | Eliminar sala |

**Ejemplo de POST /rooms:**
```json
{
  "name": "Sala IMAX Premium",
  "capacity": 200
}
```

---

### 📝 RESERVACIONES

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/reservations` | Listar todas las reservaciones |
| GET | `/reservations/:id` | Obtener reservación por ID |
| POST | `/reservations` | Crear nueva reservación |
| PUT | `/reservations/:id` | Actualizar reservación |
| POST | `/reservations/:id/cancel` | Cancelar reservación |
| DELETE | `/reservations/:id` | Eliminar reservación |

**Ejemplo de POST /reservations:**
```json
{
  "ticketId": "uuid-aqui",
  "userName": "Juan Pérez",
  "userEmail": "juan@example.com"
}
```

---

## 🧪 Testing con Thunder Client

1. Abre VS Code
2. Instala extensión "Thunder Client"
3. Click en icono de ⚡ (rayo)
4. Click en "+ New Request"
5. Ingresa:
   - Método: GET
   - URL: `http://localhost:3000/movies`
6. Click en "Send"

---

## 📂 Estructura del Proyecto

```
backend-cine-uvm-final/
├── app.js                          (Servidor principal)
├── package.json                    (Dependencias)
├── .gitignore
├── README.md
│
├── /models/                        (Capa de datos)
│   ├── Movie.js
│   ├── Function.js
│   ├── Ticket.js
│   ├── Room.js
│   └── Reservation.js
│
├── /controllers/                   (Capa lógica HTTP)
│   ├── MovieController.js
│   ├── FunctionController.js
│   ├── TicketController.js
│   ├── RoomController.js
│   └── ReservationController.js
│
├── /routes/                        (Definición de endpoints)
│   ├── movies.js
│   ├── functions.js
│   ├── tickets.js
│   ├── rooms.js
│   └── reservations.js
│
└── /views/                         (Plantillas EJS)
    ├── index.ejs
    ├── movies.ejs
    ├── functions.ejs
    ├── tickets.ejs
    └── rooms.ejs
```

---

## 🏗️ Arquitectura

**Patrón MVC (Model-View-Controller) + Separación de Responsabilidades**

1. **Modelos**: Lógica de datos y operaciones CRUD
2. **Controladores**: Procesamiento de requests HTTP
3. **Rutas**: Mapeo de endpoints
4. **Vistas**: Renderizado dinámico con EJS

---

## 💾 Almacenamiento

**Base de datos**: En memoria (Arrays JavaScript)

⚠️ **NOTA**: Los datos se pierden al reiniciar el servidor. Para producción, implementar una base de datos real (MySQL, MongoDB, PostgreSQL, etc.)

---

## 🎬 Características

✅ **12+ endpoints funcionales**
✅ **UUID v4 para IDs únicos** (RFC 4122)
✅ **Validación de campos requeridos** (HTTP 400)
✅ **Manejo robusto de errores** (HTTP 404, 500)
✅ **Métodos especiales**: `getLast5()`, `getByDateRange()`
✅ **Relaciones entre entidades**: Movie → Function → Ticket → Reservation
✅ **Dashboard HTML interactivo**
✅ **Vistas dinámicas con EJS**

---

## 📊 Códigos de Estado HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado
- **400 Bad Request**: Validación fallida
- **404 Not Found**: Recurso no existe
- **500 Internal Server Error**: Error del servidor

---

## 🚀 Próximos Pasos

1. Implementar autenticación JWT
2. Migrar a base de datos real
3. Añadir validación con Joi/Yup
4. Implementar paginación
5. Documentación con Swagger/OpenAPI

---

## 👨‍💻 Autor Contribuciones

**Martín Morfe (8263711)**
- Modelos (Movie, Function, Ticket)
- Controladores y rutas principales
- Documentación técnica

**Martín Alejandro Carballo (30539018)**
- Modelos (Room, Reservation)
- Vistas EJS y frontend
- Testing y validación

---

## 📄 Licencia

Uso académico permitido

---

## 📞 Contacto

**Universidad**: Valle del Momboy (UVM)
**Cátedra**: Backend 2026B
**Email**: mmorfe.engineer@gmail.com
**GitHub**: https://github.com/mmorfe-engineer/backend-e1-cine-uvm-2026b

---

**Última actualización**: 26 de Mayo de 2026
