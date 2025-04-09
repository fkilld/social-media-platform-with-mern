// Import mongoose library for MongoDB object modeling and schema definition
const mongoose = require('mongoose')
// Import bcryptjs library for password hashing and encryption
const bcrypt = require('bcryptjs')

// Define the user schema using mongoose.Schema constructor
const userSchema = new mongoose.Schema({
  // Username field definition
  username: {
    type: String,         // Set the data type as String
    required: true,       // Make this field mandatory
    unique: true,         // Ensure usernames are unique in the database
    trim: true,          // Remove whitespace from both ends of the string
  },
  // Email field definition  
  email: {
    type: String,         // Set the data type as String
    required: true,       // Make this field mandatory
    unique: true,         // Ensure emails are unique in the database
    trim: true,          // Remove whitespace from both ends
    lowercase: true,      // Convert email to lowercase before saving
  },
  // Password field definition
  password: {
    type: String,         // Set the data type as String
    required: true,       // Make this field mandatory
    minlength: 6,        // Enforce minimum password length of 6 characters
  },
  // Timestamp for when user account was created
  createdAt: {
    type: Date,           // Set the data type as Date
    default: Date.now,    // Automatically set to current date/time when record is created
  },
})

// Middleware that runs before saving user document to hash the password
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()

  try {
    // Generate a salt with cost factor 10 (higher = more secure but slower)
    const salt = await bcrypt.genSalt(10)
    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt)
    // Continue with the save operation
    next()
  } catch (error) {
    // If error occurs during hashing, pass it to the next middleware
    next(error)
  }
})

// Instance method to compare a candidate password with user's hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Use bcrypt to compare the candidate password with stored hash
  // Returns true if passwords match, false otherwise
  return bcrypt.compare(candidatePassword, this.password)
}

// Create and export the User model using the schema
// 'User' is the collection name in MongoDB (automatically pluralized)
module.exports = mongoose.model('User', userSchema)
