# 🎬 Sistema de Gestión de Cine - Backend REST API

**Universidad Valle del Momboy (UVM) | Cátedra Backend 2026B | E-Actividad 2.1 - Almacenamiento e Interfaces**

---

## 📋 Información del Proyecto

- **Título**: Sistema de Gestión de Cine - UVM Backend 2026B
- **Versión**: 2.0.0
- **Evaluación**: E-Actividad 2.1
- **Autores**:
  - Martín Morfe Flores (C.I. 8.263.711) - Líder Técnico
  - Martín Alejandro Carballo (C.I. 30.539.018) - Desarrollador Full-Stack
- **Repositorio**: https://github.com/mmorfe-engineer/backend-e1-cine-uvm-2026b
- **GitHub Pages**: https://mmorfe-engineer.github.io/backend-e1-cine-uvm-2026b
- **Deploy**: Railway.app (MySQL Cloud)

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
| **EJS** | 3.1.9 | Plantillas |
| **method-override** | 3.0.0 | Métodos HTTP |
| **nodemon** | 3.0.2 | Auto-reload (dev) |

**Arquitectura**: MVC (Model-View-Controller) + Separación de Responsabilidades

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

### 3. Configurar base de datos MySQL
```bash
cp .env.example .env
nano .env  # Editar con tus credenciales
mysql -u root -p < database/schema.sql
```

### 4. Instalar dependencias
```bash
npm install
```

### 5. Iniciar el servidor
```bash
npm start      # Producción
npm run dev   # Desarrollo (con nodemon)
```

---

## 📚 ENDPOINTS PRINCIPALES

| Entidad | Métodos | Endpoints Especial |
|---------|---------|-------------------|
| **Movies** | CRUD | `/movies/:id/functions` |
| **Rooms** | CRUD | - |
| **Functions** | CRUD | `/functions/last5`, `/functions/range` |
| **Tickets** | CRUD | `/tickets/:id/reserve`, `/tickets/function/:id` |
| **Reservations** | CRUD | `/reservations/:id/cancel` (transacción) |

### Ejemplo de uso:
```bash
# Listar películas
curl http://localhost:3000/movies

# Crear película
curl -X POST -H "Content-Type: application/json" -d '{"title":"Dune Part Two","duration":166}' http://localhost:3000/movies

# Últimas 5 funciones
curl http://localhost:3000/functions/last5

# Cancelar reservación (transacción)
curl -X POST http://localhost:3000/reservations/e1f2a3b4-0001-4000-8000-000000000001/cancel
```

---

## ⭐ FUNCIONES TÉCNICAS DESTACADAS

1. **getLast5()**: Retorna 5 funciones con JOIN a películas y salas
2. **getByDateRange(start, end)**: Filtra funciones por fecha con BETWEEN
3. **Reservation.cancel()**: Transacción atómica con COMMIT/ROLLBACK

---

## 🏗️ Arquitectura

**MVC + SoC**:
- **routes/**: Endpoints REST
- **controllers/**: Clases con métodos `static async`
- **models/**: Operaciones CRUD con mysql2/promise
- **config/db.js**: Pool de conexión
- **views/**: Plantillas EJS
- **public/css/**: Tema oscuro profesional

---

## 📂 Estructura

```
backend-e1-cine-uvm-2026b/
├── config/db.js              # Pool MySQL
├── database/schema.sql       # Schema + seed data
├── app.js                    # Servidor Express
├── package.json              # Dependencias
├── .env.example               # Plantilla env
├── README.md                 # Documentación
├── models/                   # 5 modelos
├── controllers/              # 5 controladores
├── routes/                   # 5 rutas
├── views/                    # Vistas EJS
├── public/css/style.css      # Tema oscuro
└── docs/                     # GitHub Pages
```

---

## 🎬 Características

✅ 28+ endpoints REST
✅ Controladores como Clases con métodos `static async`
✅ async/await en todos los modelos
✅ UUID v4 en todos los IDs
✅ Base de datos MySQL con FK reales
✅ Transacciones MySQL atómicas
✅ Vistas EJS CRUD
✅ Tema oscuro responsive

---

## 👨‍💻 Equipo

- **Martín Morfe Flores**: Arquitectura, MySQL, Modelos Movie/Function
- **Martín Alejandro Carballo**: Modelos Room/Ticket/Reservation, Vistas, CSS

---

**Última actualización**: Junio 2026
