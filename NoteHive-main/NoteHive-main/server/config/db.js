const { MongoClient } = require("mongodb");
require("dotenv").config();

let db; // To store the database connection

const connectDB = async () => {
    try {
        const client = new MongoClient(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await client.connect();
        db = client.db("yourDatabaseName"); // Set your actual database name
        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Exit process if connection fails
    }
};

// Function to get the database instance
const getDB = () => {
    if (!db) {
        throw new Error("Database not initialized. Call connectDB() first.");
    }
    return db;
};

module.exports = { connectDB, getDB };
