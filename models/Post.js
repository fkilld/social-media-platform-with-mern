// Import mongoose library which provides MongoDB object modeling and schema definition tools
const mongoose = require('mongoose')

// Create a new schema definition for Posts using mongoose.Schema constructor
const postSchema = new mongoose.Schema({
  // Title field for the post
  title: {
    type: String,         // Define title as String type
    required: true,       // Make title mandatory for all posts
    trim: true,          // Remove whitespace from beginning and end of title
  },
  // Content field to store the main body of the post
  content: {
    type: String,         // Define content as String type
    required: true,       // Make content mandatory for all posts
  },
  // Author field to link post to the user who created it
  author: {
    type: mongoose.Schema.Types.ObjectId,  // Use MongoDB ObjectId type to reference User document
    ref: 'User',                          // Reference the User model for population
    required: true,                       // Make author mandatory for all posts
  },
  // Timestamp for when the post was created
  createdAt: {
    type: Date,           // Define as Date type
    default: Date.now,    // Automatically set to current date/time when post is created
  },
  // Timestamp for when the post was last updated
  updatedAt: {
    type: Date,           // Define as Date type
    default: Date.now,    // Initially set to creation time, updated when post is modified
  },
  // Array of user IDs who have liked this post
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,  // Each like references a User document
      ref: 'User',                          // Reference the User model for population
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
})

// Middleware that runs before saving any post document
// Updates the updatedAt timestamp to track when posts are modified
postSchema.pre('save', function (next) {
  this.updatedAt = Date.now()  // Set updatedAt to current timestamp
  next()                       // Call next to continue with the save operation
})

// Create and export the Post model using the schema
// 'Post' will be the collection name in MongoDB (automatically pluralized to 'posts')
module.exports = mongoose.model('Post', postSchema)
