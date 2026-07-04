require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, SECRET_KEY, { expiresIn: '1h' });
};

// Middleware: Authenticate JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(403).json({ message: "Invalid or missing token format." });
  }

  const actualToken = token.replace('Bearer ', '');

  jwt.verify(actualToken, SECRET_KEY, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired. Please login again." });
      }
      return res.status(403).json({ message: "Invalid token." });
    }
    req.user = user; // Attach user details
    next();
  });
};

// Middleware: Check Admin Role
const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { generateToken, authenticateToken, authorizeAdmin };
