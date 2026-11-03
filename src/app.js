
const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const userRoutes = require('./routes/user.routes');

// Conectar rutas
app.use(authRoutes);
app.use(projectRoutes);
app.use(userRoutes);

module.exports = app;
