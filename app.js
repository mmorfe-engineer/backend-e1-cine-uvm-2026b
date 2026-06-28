'use strict';
require('dotenv').config();

const express        = require('express');
const path           = require('path');
const methodOverride = require('method-override');
const cookieParser   = require('cookie-parser');
const { optionalAuth } = require('./middlewares/auth');

const app  = express();
const PORT = process.env.PORT || 3000;

// ============================================
// CONFIGURACIÓN DE LA APLICACIÓN
// ============================================

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware opcional de autenticación para contexto de usuario en vistas
app.use(optionalAuth);

// ============================================
// RUTAS
// ============================================

// Ruta principal
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Sistema de Gestión de Cine - UVM',
    endpoints: [
      { method: 'GET',    url: '/movies',              desc: 'Listar películas' },
      { method: 'GET',    url: '/movies/:id',           desc: 'Película por ID' },
      { method: 'POST',   url: '/movies',              desc: 'Crear película' },
      { method: 'PUT',    url: '/movies/:id',           desc: 'Actualizar película' },
      { method: 'DELETE', url: '/movies/:id',           desc: 'Eliminar película' },
      { method: 'GET',    url: '/rooms',               desc: 'Listar salas' },
      { method: 'POST',   url: '/rooms',               desc: 'Crear sala' },
      { method: 'PUT',    url: '/rooms/:id',            desc: 'Actualizar sala' },
      { method: 'DELETE', url: '/rooms/:id',            desc: 'Eliminar sala' },
      { method: 'GET',    url: '/functions',            desc: 'Listar funciones' },
      { method: 'GET',    url: '/functions/last5',      desc: 'Últimas 5 funciones' },
      { method: 'GET',    url: '/functions/range',      desc: 'Funciones por rango de fecha' },
      { method: 'POST',   url: '/functions',            desc: 'Crear función' },
      { method: 'DELETE', url: '/functions/:id/movie',  desc: 'Desvincular película' },
      { method: 'GET',    url: '/tickets',              desc: 'Listar tickets' },
      { method: 'POST',   url: '/tickets',              desc: 'Crear ticket' },
      { method: 'POST',   url: '/tickets/:id/reserve',  desc: 'Reservar ticket' },
      { method: 'GET',    url: '/reservations',         desc: 'Listar reservaciones' },
      { method: 'POST',   url: '/reservations',         desc: 'Crear reservación (transacción)' },
      { method: 'POST',   url: '/reservations/:id/cancel', desc: 'Cancelar reservación (transacción)' },
      { method: 'GET',    url: '/auth/login',           desc: 'Formulario de login' },
      { method: 'POST',   url: '/auth/login',           desc: 'Iniciar sesión' },
      { method: 'GET',    url: '/auth/register',        desc: 'Formulario de registro' },
      { method: 'POST',   url: '/auth/register',        desc: 'Registrar usuario' },
      { method: 'POST',   url: '/auth/logout',          desc: 'Cerrar sesión' },
      { method: 'GET',    url: '/auth/profile',         desc: 'Perfil de usuario' }
    ]
  });
});

// Rutas de autenticación (Trabajo 3)
app.use('/auth', require('./routes/auth'));

// Rutas de entidades
app.use('/movies',       require('./routes/movies'));
app.use('/rooms',        require('./routes/rooms'));
app.use('/functions',    require('./routes/functions'));
app.use('/tickets',      require('./routes/tickets'));
app.use('/reservations', require('./routes/reservations'));

// ============================================
// MANEJO DE ERRORES
// ============================================

// 404 - Ruta no encontrada
app.use((req, res, next) => {
  res.status(404);
  
  // Responder con vista EJS si se solicita HTML, JSON si es API
  if (req.accepts('html')) {
    res.render('errors/404', {
      title: '404 - Página no encontrada',
      message: `La ruta ${req.originalUrl} no existe`,
      user: req.user
    });
  } else {
    res.json({ 
      success: false, 
      error: `Ruta no encontrada: ${req.originalUrl}` 
    });
  }
});

// 500 - Error interno del servidor
app.use((err, req, res, next) => {
  console.error('❌ Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : 'Oculto en producción',
    path: req.path,
    method: req.method
  });
  
  res.status(500);
  
  if (req.accepts('html')) {
    res.render('errors/500', {
      title: '500 - Error del servidor',
      message: process.env.NODE_ENV === 'development' 
        ? err.message 
        : 'Error interno del servidor. Intente más tarde.',
      user: req.user
    });
  } else {
    res.json({ 
      success: false, 
      error: process.env.NODE_ENV === 'development' 
        ? err.message 
        : 'Error interno del servidor'
    });
  }
});

// ============================================
// INICIO DEL SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log('');
  console.log('══════════════════════════════════════════════');
  console.log('  🎬 Sistema de Gestión de Cine - UVM 2026B  ');
  console.log('══════════════════════════════════════════════');
  console.log(`  ✅ Servidor:  http://localhost:${PORT}`);
  console.log(`  🗄️  DB:        MySQL → ${process.env.DB_NAME || 'cine_uvm'}`);
  console.log(`  📡 API:       http://localhost:${PORT}/movies`);
  console.log(`  🔒 JWT:       ${process.env.JWT_SECRET ? 'Configurado' : 'NO CONFIGURADO (⚠️)'}`);
  console.log('══════════════════════════════════════════════');
});

module.exports = app;
