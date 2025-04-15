// Import the Comment model to interact with the comments collection in MongoDB
const Comment = require('../models/Comment')
// Import the Post model to verify post existence when creating comments
const Post = require('../models/Post')

// Controller function to create a new comment
// endpoint: /api/comments
// method: POST
// body: { content, postId }
// example: { content: "This is a comment", postId: "643d6d594d27c427610e0e10" }

exports.createComment = async (req, res) => {
  try {
    // Extract content and postId from request body
    const { content, postId } = req.body

    // Check if the post exists
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

      // Create the comment
    const comment = new Comment({
      content,
      author: req.user.userId, // from auth middleware
      post: postId,
    })

    // Save the comment to the database
    await comment.save()

    // Add comment to post's comments array
    post.comments.push(comment._id)
    await post.save()

    // Populate the author and post fields (just username and title for cleaner response)
    await comment.populate('author', 'username')
    await comment.populate('post', 'title')

    // Respond with populated comment
    res.status(201).json({
      message: 'Comment created successfully',
      comment,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error creating comment',
      error: error.message,
    })
  }
}


// Controller function to retrieve all comments for a specific post
// endpoint: /api/comments/post/:postId
// method: GET
exports.getComments = async (req, res) => {
  // Use try-catch to handle potential errors during comment retrieval
  try {
    // Find all comments for the specified post ID
    // populate() joins the author data to get username
    // sort() orders comments by creation date, newest first
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username')
      .sort({ createdAt: -1 })
    // Return the found comments as JSON response
    res.json(comments)
  } catch (error) {
    // If any error occurs during retrieval, return 500 status with error details
    res
      .status(500)
      .json({ message: 'Error fetching comments', error: error.message })
  }
}

// Controller function to update an existing comment
// endpoint: /api/comments/:id
// method: PUT
// body: { content }
// example: { content: "This is an updated comment" }
exports.updateComment = async (req, res) => {
  // Use try-catch to handle potential errors during comment update
  try {
    // Extract new content from request body
    const { content } = req.body
    // Find and update comment matching ID and author
    // findOneAndUpdate combines finding and updating in one operation
    // {new: true} returns the updated document instead of the original
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.id, author: req.user.userId }, // Ensure user owns comment
      { content },                                      // Update content field
      { new: true }                                    // Return updated comment
    )
    // If comment not found or user unauthorized, return 404 error
    if (!comment) {
      return res
        .status(404)
        .json({ message: 'Comment not found or unauthorized' })
    }
    // Return the updated comment as JSON response
    res.json(comment)
  } catch (error) {
    // If any error occurs during update, return 500 status with error details
    res
      .status(500)
      .json({ message: 'Error updating comment', error: error.message })
  }
}

// Controller function to delete an existing comment
// endpoint: /api/comments/:id
// method: DELETE
exports.deleteComment = async (req, res) => {
  // Use try-catch to handle potential errors during comment deletion
  try {
    // Find and delete comment matching ID and author
    // findOneAndDelete combines finding and deleting in one operation
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,         // Match comment by ID
      author: req.user.userId,    // Ensure user owns comment
    })
    // If comment not found or user unauthorized, return 404 error
    if (!comment) {
      return res
        .status(404)
        .json({ message: 'Comment not found or unauthorized' })
    }
    // Return success message after successful deletion
    res.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    // If any error occurs during deletion, return 500 status with error details
    res
      .status(500)
      .json({ message: 'Error deleting comment', error: error.message })
  }
}
