// Import the jsonwebtoken library which provides methods for creating and verifying JWTs
const jwt = require('jsonwebtoken')

// Export a middleware function that takes request, response and next function as parameters
// This middleware will be used to protect routes that require authentication
module.exports = (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    // The '?' optional chaining operator prevents errors if Authorization header is missing
    // replace() removes 'Bearer ' prefix from the token string
    const token = req.header('Authorization')?.replace('Bearer ', '')

    // If no token is found in the header, return 401 Unauthorized
    // This prevents unauthenticated access to protected routes
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' })
    }

    // Verify the token using the JWT_SECRET from environment variables
    // This checks if the token is valid and hasn't been tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach the decoded token payload to the request object
    // This makes the user data (like userId) available to subsequent middleware and route handlers
    req.user = decoded

    // Call next() to pass control to the next middleware function
    // This allows the request to proceed to the protected route if authentication is successful
    next()
  } catch (error) {
    // If token verification fails (invalid/expired token), return 401 Unauthorized
    // This handles cases where the token is malformed or has been tampered with
    res.status(401).json({ message: 'Token is not valid' })
  }
}
