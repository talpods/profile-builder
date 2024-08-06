const express = require('express');
const helloRoutes = require('./routes/helloRoutes');
const config = require('./config/config');

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', helloRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
