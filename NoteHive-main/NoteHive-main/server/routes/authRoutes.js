const express = require("express");
const { register, login, logout , sendOTP,
    verifyOTPAndRegister} = require("../controllers/authController");
const User = require("../models/userModel");  // ✅ Import Mongoose User Model

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/send-otp", sendOTP);  // new
router.post("/verify-otp", verifyOTPAndRegister); // new
module.exports = router;
