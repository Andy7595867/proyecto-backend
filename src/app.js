
const express = require('express');
const cors = require ('cors')
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const userRoutes = require('./routes/user.routes');

// Conectar rutas
app.use('/api/v1', authRoutes);
app.use('/api/v1',projectRoutes);
app.use('/api/v1',userRoutes);

module.exports = app;
