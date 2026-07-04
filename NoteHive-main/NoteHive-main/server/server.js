const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const {connectDB} = require("./config/db");

// ✅ Load environment variables
dotenv.config();

const app = express();

// ✅ Middleware (must come before routes)
app.use(express.json()); // Ensures JSON parsing
app.use(cors({
    origin: "http://localhost:3000", // or use "*" in dev
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));// Enables cross-origin requests
  app.options('*', cors()); // Preflight handling

connectDB();

// ✅ Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const notesRoutes = require("./routes/notesRoutes");
const triviaRoutes=require("./routes/triviaRoutes");
// const profileRoutes=require("./routes/profileRoutes");



// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", notesRoutes);
app.use("/api",triviaRoutes);
// app.use("/api/users",profileRoutes);

// ✅ Root route for testing
app.get("/", (req, res) => {
    res.send("🚀 Server is running!");
});

// ✅ Connect to MongoDB
mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit if database connection fails
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
