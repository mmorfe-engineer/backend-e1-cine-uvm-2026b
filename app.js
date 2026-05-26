const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware de logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method.toUpperCase()} ${req.path}`);
  next();
});

// Rutas
const moviesRouter = require('./routes/movies');
const functionsRouter = require('./routes/functions');
const ticketsRouter = require('./routes/tickets');
const roomsRouter = require('./routes/rooms');
const reservationsRouter = require('./routes/reservations');

app.use('/movies', moviesRouter);
app.use('/functions', functionsRouter);
app.use('/tickets', ticketsRouter);
app.use('/rooms', roomsRouter);
app.use('/reservations', reservationsRouter);

// Ruta raíz - Dashboard
app.get('/', (req, res) => {
  res.render('index');
});

// Rutas de vistas
app.get('/view/movies', (req, res) => {
  const Movie = require('./models/Movie');
  const movies = Movie.getAll();
  res.render('movies', { movies });
});

app.get('/view/functions', (req, res) => {
  const Function = require('./models/Function');
  const functions = Function.getAll();
  res.render('functions', { functions });
});

app.get('/view/tickets', (req, res) => {
  const Ticket = require('./models/Ticket');
  const tickets = Ticket.getAll();
  res.render('tickets', { tickets });
});

app.get('/view/rooms', (req, res) => {
  const Room = require('./models/Room');
  const rooms = Room.getAll();
  res.render('rooms', { rooms });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method,
    message: 'El endpoint solicitado no existe. Verifica la URL en GET http://localhost:3000'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  ✅ SERVIDOR DE CINE - UVM BACKEND 2026B');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  📍 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`  🎬 Dashboard: http://localhost:${PORT}`);
  console.log(`  📡 API REST disponible en todos los endpoints`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('📚 ENDPOINTS DISPONIBLES:');
  console.log('  🎬 GET    /movies');
  console.log('  🎬 POST   /movies');
  console.log('  🎞️  GET    /functions');
  console.log('  🎞️  POST   /functions');
  console.log('  🎫 GET    /tickets');
  console.log('  🎫 POST   /tickets');
  console.log('  🚪 GET    /rooms');
  console.log('  🚪 POST   /rooms');
  console.log('  📝 GET    /reservations');
  console.log('  📝 POST   /reservations');
  console.log('');
  console.log('Presiona CTRL+C para detener el servidor');
  console.log('');
});

module.exports = app;
