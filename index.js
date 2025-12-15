require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jobRoutes = require('./routes/jobRoutes');
const jobNewsRoutes = require('./routes/jobNewsRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
// app.use(corsConfig);
// app.use(express.json());


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://jobwebclient.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/news', jobNewsRoutes);
app.use('/api/admin', adminRoutes);

app.listen(8080, () => {
  console.log('Server running on port 8080');
});