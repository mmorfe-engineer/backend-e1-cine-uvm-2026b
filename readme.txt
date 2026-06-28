================================================================================
SISTEMA DE GESTION DE CINE - UVM BACKEND 2026B
TRABAJO 3: Autenticación JWT + Roles + Migraciones
================================================================================

UNIVERSIDAD: Universidad Valle del Momboy (UVM) - Venezuela
MATERIA: Backend
CATEDRA: Backend 2026B
DOCENTE: Prof. Anggelo Huz

AUTORES:
- Martín Morfe Flores (C.I. 8.263.711)
- Martín Alejandro Carballo (C.I. 30.539.018)

REPOSITORIO: https://github.com/mmorfe-engineer/backend-e1-cine-uvm-2026b

================================================================================
INSTRUCCIONES TECNICAS DE DESPLIEGUE Y EJECUCION
================================================================================

1. PRE-REQUISITOS
   - Node.js version 14 o superior
   - MySQL 8.0 o superior
   - git
   - npm

2. CLONAR EL REPOSITORIO
   git clone https://github.com/mmorfe-engineer/backend-e1-cine-uvm-2026b.git
   cd backend-e1-cine-uvm-2026b

3. CONFIGURAR VARIABLES DE ENTORNO (.env)
   a) Copiar el archivo de ejemplo:
      cp .env.example .env
   
   b) Editar el archivo .env con tus credenciales reales:
      nano .env
   
   c) El archivo .env debe contener las siguientes variables:
      
      # Configuración del servidor
      PORT=3000
      NODE_ENV=development
      
      # Configuración de MySQL
      DB_HOST=localhost
      DB_PORT=3306
      DB_USER=tu_usuario_mysql
      DB_PASSWORD=tu_contraseña_mysql
      DB_NAME=cine_uvm
      
      # Configuración JWT (para autenticación)
      JWT_SECRET=tu_secreto_seguro_minimo_32_caracteres_aleatorios
      JWT_EXPIRES_IN=24h
   
   d) IMPORTANTE: El archivo .env NO debe subirse a GitHub.
      Ya está configurado en .gitignore para ser ignorado.
      
   e) Para generar un JWT_SECRET seguro, ejecuta:
      node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

4. INSTALAR DEPENDENCIAS
   npm install

5. EJECUTAR MIGRACION DE BASE DE DATOS
   npm run migrate
   
   Esto creará:
   - La base de datos 'cine_uvm'
   - Todas las tablas (movies, rooms, functions, tickets, reservations, users)
   - Vistas SQL
   - Datos iniciales (películas, salas, funciones, tickets)

6. INSERTAR USUARIOS DE PRUEBA (Opcional)
   npm run seed
   
   Esto creará 5 usuarios de prueba:
   - admin@cine-uvm.edu.ve / contraseña: admin123 (rol: admin)
   - mmorfe@cine-uvm.edu.ve / contraseña: admin123 (rol: admin)
   - mcarballo@cine-uvm.edu.ve / contraseña: staff123 (rol: staff)
   - taquilla@cine-uvm.edu.ve / contraseña: staff123 (rol: staff)
   - cliente@test.com / contraseña: viewer123 (rol: viewer)

7. INICIAR EL SERVIDOR
   npm start      # Para producción
   npm run dev   # Para desarrollo (con nodemon y auto-reload)

8. ACCEDER AL SISTEMA
   Abrir el navegador en: http://localhost:3000
   
   Para probar la API con curl:
   curl http://localhost:3000/movies

================================================================================
ARCHIVOS Y ESTRUCTURA REQUERIDA
================================================================================

1. ARCHIVOS QUE DEBEN EXISTIR (ya están en el repositorio):
   - app.js
   - package.json
   - .env.example
   - .gitignore
   - railway.json
   - nixpacks.toml
   - config/db.js
   - config/jwt.js (NUEVO para Trabajo 3)
   - database/schema.sql (actualizado)
   - database/migrate.js (NUEVO para Trabajo 3)
   - database/seed.js (NUEVO para Trabajo 3)
   - models/User.js (NUEVO para Trabajo 3)
   - controllers/AuthController.js (NUEVO para Trabajo 3)
   - middlewares/auth.js (NUEVO para Trabajo 3)
   - middlewares/roles.js (NUEVO para Trabajo 3)
   - routes/auth.js (NUEVO para Trabajo 3)
   - views/auth/*.ejs (NUEVO para Trabajo 3)
   - views/errors/*.ejs (NUEVO para Trabajo 3)
   - public/css/style.css (actualizado)

2. ARCHIVOS QUE NO DEBEN SUBIRSE A GITHUB:
   - .env (contiene credenciales sensibles)
   - node_modules/
   - .DS_Store
   - *.log
   - *.sqlite
   - *.db

3. ESTRUCTURA DE CARPETAS:
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
   ├── docs/
   │   └── INFORME_TRABAJO_3.md
   ├── .env.example
   ├── .gitignore
   ├── package.json
   ├── package-lock.json
   ├── railway.json
   └── nixpacks.toml

================================================================================
PROGRAMAS Y DEPENDENCIAS REQUERIDAS
================================================================================

1. PROGRAMAS A INSTALAR:
   - Node.js: https://nodejs.org/ (v14+)
   - MySQL: https://dev.mysql.com/downloads/ (v8.0+)
   - Git: https://git-scm.com/
   - npm: (viene con Node.js)

2. DEPENDENCIAS DE NODE.JS (se instalan automaticamente con npm install):
   - express: ^4.18.2
   - mysql2: ^3.6.5
   - dotenv: ^16.0.0
   - ejs: ^3.1.9
   - uuid: ^9.0.0
   - method-override: ^3.0.0
   - bcrypt: ^5.1.1 (NUEVO para Trabajo 3)
   - jsonwebtoken: ^9.0.2 (NUEVO para Trabajo 3)
   - cookie-parser: ^1.4.6 (NUEVO para Trabajo 3)
   - nodemon: ^3.0.2 (desarrollo)

3. COMANDOS DISPONIBLES:
   - npm start: Inicia el servidor en producción
   - npm run dev: Inicia el servidor con nodemon (desarrollo)
   - npm run migrate: Ejecuta la migración de la base de datos
   - npm run seed: Inserta usuarios de prueba

================================================================================
CONFIGURACION DE .env
================================================================================

El archivo .env debe tener el siguiente formato:

# Configuracion del servidor
PORT=3000
NODE_ENV=development

# Configuracion de MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=cine_uvm

# Configuracion JWT (Trabajo 3)
JWT_SECRET=tu_secreto_jwt_minimo_32_caracteres_aleatorios
JWT_EXPIRES_IN=24h

NOTA: En Railway, estas variables se configuran en el panel de control.

================================================================================
ENLACE AL VIDEO DE DEMOSTRACION
================================================================================

Video en YouTube: (Pendiente - se agregara antes de la entrega)
Etiquetas: #univalledelmomboy #tareaUVM

El video demostrara:
- Funcionamiento del sistema de autenticacion
- Roles y permisos
- Operaciones exclusivas por rol
- Partes mas complejas del codigo
- Participacion de cada integrante

================================================================================
PARTICIPACION DEL EQUIPO
================================================================================

MARTIN MORFE FLORES (40% - Arquitecto/Lider Tecnico):
- Configuracion de JWT (.env.example, config/jwt.js)
- Modelo de base de datos (schema.sql con tabla users)
- Scripts de migracion (database/migrate.js)
- Script de seed (database/seed.js)
- Actualizacion de app.js con manejo de errores
- Vistas de error (404.ejs, 500.ejs)
- Layout base (layout.ejs)
- Actualizacion de header.ejs con contexto de usuario
- Estilos CSS para autenticacion
- Documentacion (README.md, INFORME_TRABAJO_3.md)

MARTIN ALEJANDRO CARBALLO (60% - Desarrollador Full-Stack):
- Modelo User.js con bcrypt
- Controlador AuthController.js
- Rutas de autenticacion (routes/auth.js)
- Middleware de autenticacion (middlewares/auth.js)
- Middleware de roles (middlewares/roles.js)
- Actualizacion de rutas (movies, rooms, functions, tickets, reservations)
- Actualizacion de controladores (ReservationController.js)
- Actualizacion de modelos (Reservation.js)
- Vistas de autenticacion (login.ejs, register.ejs, profile.ejs)
- Vistas de error (401.ejs, 403.ejs)
- Actualizacion de package.json con dependencias
- Integracion final y pruebas

================================================================================
NOTAS ADICIONALES
================================================================================

1. TODOS LOS CONTROLADORES SON CLASES: 
   Como se solicito en el Trabajo 2.1, todos los controladores son clases
   con metodos static async.

2. SEPARACION DE RESPONSABILIDADES:
   - Controllers: Logica de negocio
   - Models: Acceso a base de datos
   - Routes: Definicion de endpoints
   - Middlewares: Logica transversal (auth, roles)
   - Config: Configuracion centralizada
   - Views: Presentacion

3. MANEJO DE ERRORES:
   - Errores 401: No autorizado (falta token o token invalido)
   - Errores 403: Prohibido (token valido pero sin permisos)
   - Errores 404: No encontrado
   - Errores 500: Error interno del servidor
   - Vistas EJS para errores HTML
   - JSON para errores API

4. VARIABLES DE ENTORNO:
   Todas las credenciales sensibles se leen desde .env
   NUNCA se codifican en el código fuente.

5. DESPLIEGUE EN RAILWAY:
   El proyecto esta configurado para Railway con:
   - railway.json
   - nixpacks.toml
   Configurar las variables de entorno en el panel de Railway.

================================================================================
FECHA DE ENTREGA: Junio 2026
ULTIMA ACTUALIZACION: Junio 2026
================================================================================
