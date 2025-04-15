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
// endpoint: /api/posts
// method: GET

exports.getPosts = async (req, res) => {
  try {
    // Find all posts and populate the author field with username
    // populate is used to get the user details from the user model
    // populate is mongoose method to populate the author field with username
    // so author is here the _id of the user and username is the field in the user model
    // sort is used to sort the posts by createdAt in descending order
    // -1 is used to sort in descending order if we use 1 then it will be in ascending order 

    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
    res.json(posts)
  } catch (error) {
    // If there's an error, send a 500 Internal Server Error status with the error message
    res
      .status(500)
      .json({ message: 'Error fetching posts', error: error.message })
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