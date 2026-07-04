const express = require("express");
const { getAllUsers, promoteToAdmin, deleteUser } = require("../controllers/userController");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Get all users (Admin Only)
router.get("/users", authenticate, authorizeAdmin, getAllUsers);

// ✅ Promote user to admin (Admin Only)
router.put("/promote/:id", authenticate, authorizeAdmin, promoteToAdmin);

// ✅ Delete user (Admin Only)
router.delete("/users/:id", authenticate, authorizeAdmin, deleteUser);

module.exports = router;
