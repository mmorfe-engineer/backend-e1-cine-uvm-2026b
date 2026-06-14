'use strict';
require('dotenv').config();

const express        = require('express');
const path           = require('path');
const methodOverride = require('method-override');

const app  = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/movies',       require('./routes/movies'));
app.use('/rooms',        require('./routes/rooms'));
app.use('/functions',    require('./routes/functions'));
app.use('/tickets',      require('./routes/tickets'));
app.use('/reservations', require('./routes/reservations'));

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
      { method: 'POST',   url: '/reservations/:id/cancel', desc: 'Cancelar reservación (transacción)' }
    ]
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: `Ruta no encontrada: ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ success: false, error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log('');
  console.log('══════════════════════════════════════════════');
  console.log('  🎬 Sistema de Gestión de Cine - UVM 2026B  ');
  console.log('══════════════════════════════════════════════');
  console.log(`  ✅ Servidor:  http://localhost:${PORT}`);
  console.log(`  🗄️  DB:        MySQL → cine_uvm`);
  console.log(`  📡 API:       http://localhost:${PORT}/movies`);
  console.log('══════════════════════════════════════════════');
});

module.exports = app;
