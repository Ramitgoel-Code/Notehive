
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const sendOTPEmail = require("../utils/sendOTPEmail");
const otpStore = new Map(); // { email: { otp, expiresAt, userData } }

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id: id.toString(), role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
const register = async (req, res) => {
    const { username, email, password, role = "general" } = req.body;

    try {
        const db = getDB();
        if (!db) return res.status(500).json({ message: "Database connection error." });

        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, email, password: hashedPassword, role, loggedIn: false };

        const result = await usersCollection.insertOne(newUser);
        console.log("Inserted User:", result);
        return res.status(201).json({
            message: "Registration successful!",
            username: newUser.username,
            userId: result.insertedId.toString(),
        });

    } catch (error) {
        return res.status(500).json({ message: "Registration failed.", error: error.message });
    }
};

// Login User
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Received login request:", { email, password: password ? "Provided" : "Not Provided" });

        const db = getDB();
        if (!db) return res.status(500).json({ message: "Database connection error." });

        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email });
        console.log("User found in DB:", user);
        if (!user) {
            console.warn("No account found for email:", email);
            return res.status(400).json({ message: "No account found with this email." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Password Match:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        await usersCollection.updateOne({ email }, { $set: { loggedIn: true } });

        const token = generateToken(user._id, user.role);
        console.log("Generated Token:", token);

        return res.status(200).json({
            message: "Login successful!",
            username: user.username,
            role: user.role,
            token,
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Login failed.", error: error.message });
    }
};

// Logout User
const logout = async (req, res) => {
    try {
        const db = getDB();
        if (!db) return res.status(500).json({ message: "Database connection error." });

        const usersCollection = db.collection("users");

        // Ensure _id is an ObjectId
        await usersCollection.updateOne({ _id: new ObjectId(req.user.id) }, { $set: { loggedIn: false } });

        return res.status(200).json({ message: "Logout successful!" });

    } catch (error) {
        return res.status(500).json({ message: "Logout failed.", error: error.message });
    }
};
// 1️⃣ Send OTP
const sendOTP = async (req, res) => {
    const { username, email, password, role = "general" } = req.body;

    try {
        const db = getDB();
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered." });
        }

        const otp = generateOTP();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        otpStore.set(email, {
            otp,
            expiresAt,
            userData: { username, email, password, role }
        });

        await sendOTPEmail(email, otp);

        res.status(200).json({ message: "OTP sent to email." });
    } catch (err) {
        res.status(500).json({ message: "Failed to send OTP.", error: err.message });
    }
};

// 2️⃣ Verify OTP and register
const verifyOTPAndRegister = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const record = otpStore.get(email);
        if (!record) {
            return res.status(400).json({ message: "No OTP found for this email." });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ message: "OTP expired." });
        }

        if (record.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        const db = getDB();
        const usersCollection = db.collection("users");

        const { username, password, role } = record.userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await usersCollection.insertOne({
            username,
            email,
            password: hashedPassword,
            role,
            loggedIn: false
        });

        otpStore.delete(email);

        return res.status(201).json({
            message: "User registered successfully!",
            userId: result.insertedId.toString(),
            username,
        });

    } catch (err) {
        res.status(500).json({ message: "Failed to verify OTP.", error: err.message });
    }
};


module.exports = {
    register,
    login,
    logout,
    sendOTP,
    verifyOTPAndRegister
};

