const jwt = require('jsonwebtoken')

// Auth middleware for protected routes using cookie-based JWT
module.exports = (req, res, next) => {
  try {
    // Read token from cookies
    const token = req.cookies?.token

    // If no token is found in cookies
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user ID to request
    req.user = decoded

    // Proceed to the next middleware or route
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' })
  }
}
