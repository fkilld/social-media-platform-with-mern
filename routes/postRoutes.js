// Import express library for creating a router
const express = require('express')
// Create a new router instance
const router = express.Router()
// Import the post controller for handling post-related routes
const postController = require('../controllers/postController')
// Import the auth middleware for protecting routes that require authentication
const auth = require('../middleware/auth')

// Public routes
// Get all posts
router.get('/', postController.getPosts)
// Get a single post by ID
router.get('/:id', postController.getPost)

// Protected routes
// Create a new post
router.post('/', auth, postController.createPost)
// Update an existing post
router.put('/:id', auth, postController.updatePost)
// Delete a post
router.delete('/:id', auth, postController.deletePost)
// Like a post


// Export the router instance for use in the main application file
module.exports = router
