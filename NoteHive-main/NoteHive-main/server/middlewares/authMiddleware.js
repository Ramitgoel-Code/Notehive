const jwt = require("jsonwebtoken");
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb"); // Import ObjectId

// Authenticate User Middleware
const authenticate = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied. No Token Provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract actual token

    try {
        // Verify token and decode
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Validate if 'id' exists and is a valid ObjectId
        if (!ObjectId.isValid(decoded.id)) {
            return res.status(400).json({ message: "Invalid User ID in token." });
        }

        const db = getDB();
        const usersCollection = db.collection("users");

        // Find user by ID, excluding password
        const user = await usersCollection.findOne(
            { _id: new ObjectId(decoded.id) },
            { projection: { password: 0 } }
        );

        if (!user) return res.status(404).json({ message: "User not found." });

        req.user = user; // Store user data in req.user
        next();
    } catch (error) {
        // Handling token expiry or other errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please login again." });
        }
        return res.status(403).json({ message: "Invalid or Expired Token.", error: error.message });
    }
};

// Authorize Admin Middleware
const authorizeAdmin = (req, res, next) => {
    // Check if the user has a role of "admin"
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access Denied. Admins Only." });
    }
    next();
};

module.exports = { authenticate, authorizeAdmin };
