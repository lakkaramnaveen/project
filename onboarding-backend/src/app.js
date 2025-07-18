const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use('/api/components', adminRoutes);
app.use('/api/users', userRoutes); // for data table

module.exports = app;
