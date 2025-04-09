// Import express library for creating a server
const express = require('express')
// Import cors library for handling cross-origin resource sharing
const cors = require('cors')
// Import dotenv library for loading environment variables from .env file
const dotenv = require('dotenv')
// Import connectDB function from db/connect.js file
const connectDB = require('./db/connect')

// Load environment variables
dotenv.config()

// Import routes
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')

// Create an instance of the express application
const app = express()

// Middleware
// Use cors middleware to allow cross-origin requests
app.use(cors())
// Use express.json middleware to parse JSON bodies in requests
app.use(express.json())

// Routes
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)

// Error handling middleware
// This middleware catches any errors that occur during request processing
// It logs the error stack and sends a 500 status with a generic error message
app.use((err, req, res, next) => {
  // Log the error stack for debugging purposes
  // This helps identify the source of the error in the code
  console.error(err.stack)
  // Send a 500 status with a generic error message
  // This provides a user-friendly error message while keeping the details private
  res.status(500).json({ message: 'Something went wrong!' })
})

// Start server
const PORT = process.env.PORT || 5000

const start = async () => {
  // Connect to MongoDB
  try {
    await connectDB()
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    // Log the error and exit the process if connection fails
    console.error('Error starting server:', error)
    process.exit(1)
  }
}

start()
