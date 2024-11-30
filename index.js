const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const router = require('./src/routes/userRoutes');


const app=express();
const port = process.env.PORT || 7001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', router);


app.get('/', (req, res) => {
    res.json('Server running');
  });

// Connect to MongoDB
mongoose
.connect(process.env.DBURL, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('🔥🔥Successfully Connected to MongoDB🚀🚀');
})
.catch((err) => {
  console.error('MongoDB Connection Failure', err);
  process.exit(1); // Exit process if unable to connect
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
