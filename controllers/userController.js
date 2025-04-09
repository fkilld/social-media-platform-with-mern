const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Register a new user
// http://localhost:8000/api/users/register
// {
//   "username": "azad",
//   "email": "azad@gmail.com",
//   "password": "azad123"
// }

// Export the register function as an async function that takes request and response objects as parameters
exports.register = async (req, res) => {
  try {
    // Destructure username, email and password from the request body for easy access
    const { username, email, password } = req.body

    // Check if a user with the same email or username already exists in the database
    // Using $or operator to match either email or username
    // This prevents duplicate accounts with same credentials
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })

    // If user exists, return 400 Bad Request with error message
    // This prevents creating duplicate accounts
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create a new User instance with the provided credentials
    // The password will be automatically hashed by the User model's pre-save hook
    const user = new User({ username, email, password })

    // Save the new user to the database
    // This creates the user record and generates an _id
    await user.save()

    // Generate a JWT token for authentication
    // The token contains the user's ID and expires in 24 hours
    // JWT_SECRET from environment variables is used to sign the token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    })

    // Return success response with status 201 (Created)
    // Include the JWT token for client authentication
    // Return user details excluding sensitive information like password
    res
      .cookie('token', token, {
        httpOnly: true, // prevents client-side JavaScript from accessing the cookie
        sameSite: 'Lax', // controls where the cookie can be sent from
        secure: false, // set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(201)
      .json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      })
  } catch (error) {
    // If any error occurs during the registration process
    // Return 500 Internal Server Error with error details
    // This helps with debugging while keeping error messages user-friendly
    res
      .status(500)
      .json({ message: 'Error registering user', error: error.message })
  }
}

// http://localhost:8000/api/users/login
// {
//   "email": "azad@gmail.com",
//   "password": "azad123"
// }

// Login user
// Export login function as an async route handler that takes request and response objects
exports.login = async (req, res) => {
  try {
    // Destructure email and password from request body - these are the credentials provided by user
    const { email, password } = req.body

    // Query database to find a user with the provided email
    // Using findOne since email should be unique in the database
    const user = await User.findOne({ email })

    // If no user found with that email, return 401 Unauthorized
    // We use generic "Invalid credentials" message for security (don't reveal if email exists)
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Compare provided password with hashed password stored in database
    // Using comparePassword method defined in User model that uses bcrypt
    const isMatch = await user.comparePassword(password)

    // If passwords don't match, return 401 Unauthorized
    // Again using generic message to prevent user enumeration
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // If credentials are valid, generate a new JWT token
    // Token contains user ID for future authentication
    // Using JWT_SECRET from environment variables for security
    // Token expires in 24 hours requiring user to login again
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    })

    // Send successful response with:
    // - Success message
    // - JWT token for subsequent authenticated requests
    // - User object with non-sensitive user data
    res
      .cookie('token', token, {
        httpOnly: true, // prevents client-side JavaScript from accessing the cookie
        sameSite: 'Lax', // controls where the cookie can be sent from
        secure: false, // set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(201)
      .json({
        message: 'User logged in successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      })
  } catch (error) {
    // If any error occurs during login process (e.g. database error)
    // Return 500 Internal Server Error with error details
    // This helps with debugging while keeping error messages user-friendly
    res.status(500).json({ message: 'Error logging in', error: error.message })
  }
}
exports.logout = (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out successfully' })
}
// endpoint: http://localhost:8000/api/users/profile
// method: GET
// header: Authorization: Bearer <token>

// Get user profile
// Export the getProfile function as an async function that takes request and response objects
// This endpoint requires authentication and returns the user's profile data
exports.getProfile = async (req, res) => {
  try {
    // Find user by ID from the authenticated request (req.user.userId comes from auth middleware)
    // Using select('-password') to exclude the password field from the response for security
    // The await keyword is used since findById returns a promise
    const user = await User.findById(req.user.userId).select('-password')

    // If no user is found with the given ID, return a 404 error
    // This could happen if the user was deleted but still has a valid token
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // If user is found, send the user object as JSON response
    // This includes all user fields except password due to the select('-password') above
    res.json(user)
  } catch (error) {
    // If any error occurs during the database query or response
    // Return a 500 Internal Server Error status code
    // Include both a user-friendly message and the actual error for debugging
    res
      .status(500)
      .json({ message: 'Error fetching profile', error: error.message })
  }
}
