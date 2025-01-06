


require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('./config/googleAuth'); // Google OAuth configuration

// Import routes
const studentRoutes = require('./routes/student');
const adminRoutes = require('./routes/admin');
const mentorRoutes = require('./routes/mentor');
const creatorRoutes = require('./routes/creator');
const employerRoutes = require('./routes/employer');
const supportRoutes=require('./routes/support');
const pathRoutes = require('./routes/path');



// Initialize dotenv for environment variables
const dotenv = require('dotenv');
dotenv.config();

// Create Express app
const app = express();
const cors=require("cors");

// Body-parser middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', // Use a strong secret key
    resave: false, // Prevent session from being saved on every request
    saveUninitialized: true, // Save uninitialized sessions
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

// API Routes
app.use('/admin', adminRoutes);
app.use('/mentor', mentorRoutes);
app.use('/auth', studentRoutes); // Google auth-related routes
app.use('/student', studentRoutes); // Student-related routes
app.use('/creator', creatorRoutes);
app.use('/employer', employerRoutes);
app.use('/support',supportRoutes)
app.use('/path', pathRoutes);
// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the backendd API');
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
 // Default to port 5000 if not set in .env

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
