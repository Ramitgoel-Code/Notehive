const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb"); // Import ObjectId
const User = require("../models/userModel"); 

// Fetch All Users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const db = getDB();
        const usersCollection = db.collection("users");

        const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users.", error: error.message });
    }
};

// Promote User to Admin
const promoteToAdmin = async (req, res) => {
    try {
        const db = getDB();
        const usersCollection = db.collection("users");

        const userId = new ObjectId(req.params.id); // Convert to ObjectId

        const user = await usersCollection.findOne({ _id: userId });
        if (!user) return res.status(404).json({ message: "User not found." });

        await usersCollection.updateOne({ _id: userId }, { $set: { role: "admin" } });

        res.status(200).json({ message: "User promoted to admin!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to promote user.", error: error.message });
    }
};

// Delete User
async function deleteUser(req, res) {
    try {
        const db = getDB(); // Ensure DB connection is established
        const usersCollection = db.collection('users'); // Access users collection

        const { email } = req.body; // Assuming you're passing email to identify the user
        if (!email) {
            return res.status(400).json({ message: "User email is required" });
        }

        const result = await usersCollection.deleteOne({ email });

        if (!result || result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found or already deleted" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
}

// const deleteUser = async (req, res) => {
//     try {
//         console.log("🔹 DELETE request received for user ID:", req.params.id);

//         if (!ObjectId.isValid(req.params.id)) {
//             return res.status(400).json({ message: "Invalid user ID format." });
//         }

//         const userId = new ObjectId(req.params.id);
//         const result = await User.findByIdAndDelete(userId);


//         if (result.deletedCount === 0) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         res.status(200).json({ message: "User deleted successfully." });
//     } catch (error) {
//         console.error("❌ Error deleting user:", error);
//         res.status(500).json({ message: "Failed to delete user.", error: error.message });
//     }
// };


module.exports = { getAllUsers, promoteToAdmin, deleteUser };
