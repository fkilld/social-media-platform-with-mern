// Import express library for creating a router
const express = require('express')
// Create a new router instance
const router = express.Router()
// Import the comment controller for handling comment-related routes
const commentController = require('../controllers/commentController')
// Import the auth middleware for protecting routes that require authentication
const auth = require('../middleware/auth')

// Public routes
// Get all comments for a specific post
router.get('/post/:postId', commentController.getComments)

// Protected routes
// Create a new comment
router.post('/', auth, commentController.createComment)
// Update an existing comment
router.put('/:id', auth, commentController.updateComment)
// Delete a comment
router.delete('/:id', auth, commentController.deleteComment)

// Export the router instance for use in the main application file
module.exports = router
