const Post = require('../models/Post')

// Create a new post
// endpoint: /api/posts
// method: POST
// body: { title, content }
// example: { title: "My first post", content: "This is my first post" }
exports.createPost = async (req, res) => {
  try {
    // Extract title and content from request body
    const { title, content } = req.body
    // Create a new post with the extracted title and content
    const post = new Post({
      title,
      content,
      author: req.user.userId,
    })
    // Save the new post to the database
    await post.save()
    // Send a 201 Created status with the new post in the response
    res.status(201).json(post)
  } catch (error) {
    // If there's an error, send a 500 Internal Server Error status with the error message
    res
      .status(500)
      .json({ message: 'Error creating post', error: error.message })
  }
}

// Get all posts
// endpoint: GET /api/posts?page=2&limit=5&search=react

// method: GET
// Controller function to fetch posts with search, pagination, and author details
exports.getPosts = async (req, res) => {
  try {
    // =============================
    // STEP 1: Extract Query Params
    // =============================

    // Get page number from query (default is 1 if not provided)
    const page = parseInt(req.query.page) || 1

    // Get limit of items per page (default is 10 if not provided)
    const limit = parseInt(req.query.limit) || 10

    // Get search keyword (default is empty string which means no filtering)
    const search = req.query.search || ''

    // =============================
    // STEP 2: Calculate Skip Value
    // =============================

    // This determines how many items to skip based on the current page
    // For example: page 2 with limit 10 → skip = 10 → start from 11th post
    const skip = (page - 1) * limit

    // =============================
    // STEP 3: Build Search Query
    // =============================

    // If search is provided, create a filter to match 'title' or 'content'
    // The '$regex' with 'i' makes it case-insensitive
    const searchQuery = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
          ],
        }
      : {}

    // =============================
    // STEP 4: Count Total Documents
    // =============================

    // Count total number of posts that match the search query
    // This is required to calculate pagination data like total pages
    const total = await Post.countDocuments(searchQuery)

    // =============================
    // STEP 5: Fetch Filtered Posts
    // =============================

    const posts = await Post.find(searchQuery) // Apply search query
      .populate('author', 'username')         // Populate 'author' field with 'username' only
      .sort({ createdAt: -1 })                // Sort by creation time, newest first
      .skip(skip)                             // Skip items for pagination
      .limit(limit)                           // Limit number of items returned

    // =============================
    // STEP 6: Send Final Response
    // =============================

    res.json({
      posts, // List of posts matching search and pagination
      pagination: {
        total,                     // Total matching documents
        page,                      // Current page number
        pages: Math.ceil(total / limit), // Total number of pages
        hasMore: page * limit < total,   // True if more pages exist after this
      },
    })

  } catch (error) {
    // If something goes wrong, send 500 error with message and details
    res.status(500).json({ 
      message: 'Error fetching posts', 
      error: error.message 
    })
  }
}



// Update a post
// endpoint: /api/posts/:id
// method: PUT
// body: { title, content }
// example: { title: "My updated post", content: "This is my updated post" }
exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.userId },
      { title, content },
      { new: true }
    )
    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' })
    }
    res.json(post)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating post', error: error.message })
  }
}

// Delete a post
// endpoint: /api/posts/:id
// method: DELETE
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user.userId,
    })
    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' })
    }
    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting post', error: error.message })
  }
}





// Get a single post
// endpoint: /api/posts/:id
// method: GET

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username' }, // nested population
      })

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.json(post)
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching post',
      error: error.message,
    })
  }
}


// Like a post
// endpoint: /api/posts/:id/like
// method: POST