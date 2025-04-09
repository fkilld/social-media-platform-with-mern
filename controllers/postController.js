const Post = require('../models/Post')

// Create a new post
// endpoint: /api/posts
// method: POST
// body: { title, content }
// example: { title: "My first post", content: "This is my first post" }
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body
    const post = new Post({
      title,
      content,
      author: req.user.userId,
    })
    await post.save()
    res.status(201).json(post)
  } catch (error) {
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
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
    res.json(posts)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching posts', error: error.message })
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

// Like a post
// endpoint: /api/posts/:id/like
// method: POST

