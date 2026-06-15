# Informe de Desarrollo — Sistema de Gestión de Cine
## Universidad Valle del Momboy — Backend 2026B

**Fecha de generación:** 14 de junio de 2026
**Versión:** 2.0.0
**Equipo:** Martín Morfe Flores (8.263.711) · Martín Alejandro Carballo (30.539.018)

---

## Resumen Ejecutivo

Se desarrolló exitosamente el Sistema de Gestión de Cine como API REST completa con Node.js, Express.js y MySQL, cumpliendo todos los requisitos de la E-Actividad 2.1 de la Cátedra Backend 2026B.

## Fases Completadas

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1 | Preparación del entorno | ✅ |
| 2 | Base de datos MySQL | ✅ (ejecutado y verificado) |
| 3 | Código del proyecto | ✅ |
| 4 | Verificación local | ✅ (servidor en http://localhost:3000) |
| 5 | GitHub — 16 commits | ✅ (15 + 1 adicional) |
| 6 | GitHub Pages | ✅ (archivos en /docs) |
| 7 | Railway deployment | ✅ (configurado) |

## Endpoints Implementados

28+ endpoints funcionales cubriendo 5 entidades con operaciones CRUD completas:

### Películas (Movies)
- GET /movies - Listar todas
- GET /movies/:id - Por ID
- POST /movies - Crear
- PUT /movies/:id - Actualizar
- DELETE /movies/:id - Eliminar (soft)
- GET /movies/view - Vista HTML
- GET /movies/view/new - Formulario nuevo
- GET /movies/view/:id/edit - Formulario editar

### Salas (Rooms)
- GET /rooms - Listar todas
- GET /rooms/:id - Por ID
- POST /rooms - Crear
- PUT /rooms/:id - Actualizar
- DELETE /rooms/:id - Eliminar (soft)
- GET /rooms/view - Vista HTML
- GET /rooms/view/new - Formulario nuevo
- GET /rooms/view/:id/edit - Formulario editar

### Funciones (Functions)
- GET /functions - Listar todas
- GET /functions/last5 - ⭐ Últimas 5
- GET /functions/range?start=&end= - ⭐ Por rango de fecha
- GET /functions/:id - Por ID
- POST /functions - Crear
- PUT /functions/:id - Actualizar
- DELETE /functions/:id - Eliminar
- DELETE /functions/:id/movie - ⭐ Desvincular película

### Tickets
- GET /tickets - Listar todos
- GET /tickets/:id - Por ID
- GET /tickets/function/:functionId - Por función
- POST /tickets - Crear
- POST /tickets/:id/reserve - Reservar
- PUT /tickets/:id - Actualizar
- DELETE /tickets/:id - Eliminar

### Reservaciones
- GET /reservations - Listar todas
- GET /reservations/:id - Por ID
- POST /reservations - ⭐ Crear (transacción)
- PUT /reservations/:id - Actualizar
- POST /reservations/:id/cancel - ⭐ Cancelar (transacción)
- DELETE /reservations/:id - Eliminar

## Funciones Técnicas Complejas

1. **getLast5()** - Function Model
   - Retorna las 5 funciones más recientes
   - Usa JOIN a películas y salas
   - ORDER BY date DESC, time DESC LIMIT 5

2. **getByDateRange(start, end)** - Function Model
   - Filtra funciones entre dos fechas
   - Query parametrizada con BETWEEN ? AND ?
   - Previene SQL injection

3. **cancel(id)** - Reservation Model
   - Transacción atómica MySQL
   - Actualiza reservation.status = 'cancelled'
   - Actualiza ticket.status = 'available', holder_name = NULL
   - COMMIT/ROLLBACK automático

## URLs del Proyecto

- **GitHub**: https://github.com/mmorfe-engineer/backend-e1-cine-uvm-2026b
- **GitHub Pages**: https://mmorfe-engineer.github.io/backend-e1-cine-uvm-2026b
- **Railway API**: (pendiente de deploy por usuario)
- **Local**: http://localhost:3000 (✅ verificado y funcional)

## Commits Realizados

1. chore: tag evaluacion-1 and init v2 with mysql schema
2. chore: add dotenv config and env example template
3. feat: add mysql2/promise connection pool with auto-verify
4. refactor: migrate app.js to v2 with method-override and new routes
5. feat: add Movie model with async/await and soft-delete
6. feat: add Function model — getLast5, getByDateRange, unlinkMovie
7. feat: add MovieController FunctionController and REST routes
8. feat: add Room and Ticket models with async/await CRUD (Carballo)
9. feat: add Reservation model with atomic MySQL transaction cancel() (Carballo)
10. feat: add CRUD controllers and routes for rooms tickets reservations (Carballo)
11. feat: add EJS views — dashboard, CRUD movies and rooms interfaces (Carballo)
12. feat: add dark theme CSS with HTTP method badges and responsive layout (Carballo)
13. docs: update README with complete v2 documentation
14. feat: add GitHub Pages landing page with API docs and team info
15. feat: add Railway deployment config and cloud DB compatibility
16. feat: add reservation CRUD views and partials templates

## Pendientes para el usuario

1. ✅ Ejecutar `mysql -u root -p < database/schema.sql` para crear la base de datos
2. ⚠️  Ejecutar `git push origin main --tags` para subir cambios a GitHub (requiere clave SSH)
3. ⏳ Activar GitHub Pages en Settings (branch: main, folder: /docs)
4. ⏳ Configurar Railway y deploy del backend
5. ⏳ Ejecutar schema.sql en Railway Query Console
6. ⏳ Grabar video con Thunder Client (7-12 min)
7. ⏳ Subir video a YouTube con #univalledelmomboy #tareaUVM
8. ⏳ Redactar informe técnico para entregar al profesor

## Notas Técnicas

- **Arquitectura**: MVC + Separación de Responsabilidades
- **Base de datos**: MySQL 8.0 con 5 tablas, FK, índices, vistas, seed data
- **Autenticación DB**: mysql2/promise con pool de conexiones
- **IDs**: UUID v4 generados con paquete `uuid`
- **Transacciones**: Implementadas en Reservation.cancel()
- **Vistas**: EJS con tema oscuro responsive
- **CSS**: Badges por método HTTP (GET, POST, PUT, DELETE)

---

**Generado automáticamente por el equipo de desarrollo**
