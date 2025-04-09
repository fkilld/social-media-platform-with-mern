// Import express library for creating a router
const express = require('express')
// Create a new router instance
const router = express.Router()
// Import the user controller for handling user-related routes
const userController = require('../controllers/userController')
// Import the auth middleware for protecting routes that require authentication
const auth = require('../middleware/auth')

// Public routes
// Register a new user
router.post('/register', userController.register)
// Login a user
router.post('/login', userController.login)

// Protected routes
// Get the authenticated user's profile
router.get('/profile', auth, userController.getProfile)
// Logout a user
router.post('/logout', userController.logout)
// Export the router instance for use in the main application file
module.exports = router
