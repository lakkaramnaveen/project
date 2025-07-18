const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Route registration
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/users', userRoutes);
app.use('/api/admin/config', adminRoutes);

// Fallback route for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Centralized error handler (production-friendly)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
