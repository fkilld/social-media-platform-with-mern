// Import mongoose library which provides MongoDB object modeling tools and schema definition
const mongoose = require('mongoose')

// Create a new schema definition for Comments using mongoose.Schema constructor
// This defines the structure and validation rules for comment documents
const commentSchema = new mongoose.Schema({
  // Content field to store the actual text of the comment
  content: {
    type: String,         // Define content as String type since comments are text
    required: true,       // Make content mandatory - comments must have text
    trim: true,          // Remove whitespace from start/end of content for clean data
  },
  // Author field to link comment to the user who created it
  author: {
    type: mongoose.Schema.Types.ObjectId,  // Use MongoDB ObjectId to reference User document
    ref: 'User',                          // Reference the User model for population
    required: true,                       // Make author mandatory - comments must have an author
  },
  // Post field to link comment to the post it belongs to
  post: {
    type: mongoose.Schema.Types.ObjectId,  // Use MongoDB ObjectId to reference Post document
    ref: 'Post',                          // Reference the Post model for population
    required: true,                       // Make post mandatory - comments must belong to a post
  },
  // Timestamp for when the comment was created
  createdAt: {
    type: Date,           // Define as Date type to store timestamp
    default: Date.now,    // Automatically set to current date/time when comment is created
  },
  // Timestamp for when the comment was last updated
  updatedAt: {
    type: Date,           // Define as Date type to store timestamp
    default: Date.now,    // Initially set to creation time, updated when comment is modified
  },
})

// Middleware that runs before saving any comment document
// This ensures the updatedAt timestamp is current whenever a comment is modified
commentSchema.pre('save', function (next) {
  this.updatedAt = Date.now()  // Update the timestamp to current date/time
  next()                       // Call next to continue with the save operation
})

// Create and export the Comment model using the schema
// 'Comment' will be the collection name in MongoDB (automatically pluralized to 'comments')
module.exports = mongoose.model('Comment', commentSchema)
