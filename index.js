const cors = require("cors");
const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const cookie = require('cookie-parser');
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const shortid = require("shortid");

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

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dfmpb2aii",
  api_key: "637296684939831",
  api_secret: "FTvJen8maIqkhI9KeUEpNfDjzvE",
});

// Middleware setup
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(cookie());
app.use(express.json());
app.use(express.static('public'));

// Set up CORS
app.use(cors({
  origin: 'https://6be12338-8441-409d-8878-f7bee20af9de-00-ahmtmo5negz0.pike.replit.dev',
  credentials: true,
}));

app.use((req, res, next) => {
  req.io = io;
  next();
});
// Routes
app.use('/lock', admin);
app.use('/order', find);
app.use('/create', order);

// Socket.IO middleware


// Multer and Cloudinary setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'order',
    allowedFormats: ['jpg', 'png', 'jpeg'],
    public_id: (req, file) => `${shortid.generate()}-${file.originalname}`,
  },
});
const upload = multer({ storage: storage });

// Picture upload route
app.post('/picture', upload.single('picture'), (req, res) => {
  save.create({
    file: req.file.path,
  })
  .then(() => {
    res.send(`<img src="${req.file.path}">`);
  })
  .catch(error => {
    console.error('Error saving file:', error);
    res.status(500).send('Error saving file');
  });
});

// Test the `save` model
save.find().then((data) => {
  console.log('Saved data:', data);
}).catch((error) => {
  console.error('Error fetching saved data:', error);
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
