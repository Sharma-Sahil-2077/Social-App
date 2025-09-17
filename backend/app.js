const express = require('express');
const cors = require('cors');

const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/users.routes');
const postRoutes = require('./src/routes/posts.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
