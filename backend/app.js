require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');

connectDB();

app.use(
  cors({
    origin: [
      "https://my-day-zeta.vercel.app",
      `http://localhost:5173`,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use('/api', require('./server/routes/api'));
app.use('/auth', require('./server/routes/auth'));
app.get('/', (req, res) => {
  res.send('Welcome to the MyDay API'); 
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
