const express = require('express');
const connectToDatabase = require('./connect'); // Import the function

const app = express();

// Connect to MongoDB
connectToDatabase();

app.use(express.json());
// Other middleware and route setup here...

module.exports = app;
