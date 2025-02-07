const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');  
const connectDB = require('./config/db');
const placeRoutes = require('./Routes/placesRoute');
const adminRoutes = require('./Routes/adminRoute');
const campRoutes = require('./Routes/campRoutes');



dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use(cors({
  origin: 'http://localhost:5173', // Change to your frontend's URL if different
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use('/api/places', placeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/camps', campRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
