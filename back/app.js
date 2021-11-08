const express = require('express'); 
const dbConn = require('./config/db');
const jwt = require("jsonwebtoken");
const path = require('path');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const app = express(); 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); 
//app.use(require('./routes/user'));
app.use("/api/auth", userRoutes);
app.use("/api/post", postRoutes);

app.get('/api', (req, res) => {
    res.send("Salut le monde !");
  });

module.exports = app;
