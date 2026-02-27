const cors = require("cors");
const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const cookie = require('cookie-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Import routes and database connection
const find = require('./router/find');
const admin = require('./router/admin');
const connect = require('./connection/mongodb');
const save = require('./model/save');
const order = require('./router/order');

// Connect to MongoDB
connect();

// Middleware setup
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(cookie());
app.use(express.json());
app.use(express.static('public'));

// Set up CORS
const allowedOrigins = ['https://minecraft-yfrb.onrender.com','https://pay.nitrogen.kesug.com' ,'https://6be12338-8441-409d-8878-f7bee20af9de-00-ahmtmo5negz0.pike.replit.dev'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Root route
app.get('/', (req, res) => {
  res.render('index');
});

// Routes
app.use('/lock', admin);
app.use('/order', find);
app.use('/create', order);

// Test the `save` model
// Start the server
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
