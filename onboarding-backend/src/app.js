const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Enable CORS for all origins - you can restrict this in production
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());

// Route prefixes
app.use('/api/users', userRoutes);       // Handles user-related endpoints (list, create, update, etc.)
app.use('/api/components', adminRoutes); // Handles admin config related endpoints

// Note: Avoid mounting userRoutes twice at different prefixes for clarity,
// unless you specifically want two different API paths.
// Here, '/api/user' and '/api/users' might confuse API consumers.
// Choose one consistent prefix for user routes, e.g., '/api/users'.

module.exports = app;
