const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = "secret123";

module.exports.verifyAdmin = async (req, res, next) => {

  let token = req.headers.authorization;

  // Check if the token is present
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token not provided.' });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.adminId = decoded.adminId; // Store the admin ID in the request object

    next(); // Call the next middleware or route handler
  });
}