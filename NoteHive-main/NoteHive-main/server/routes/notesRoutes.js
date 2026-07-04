const express = require("express");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");
const { createNote, getNotesBySubject, editNote, deleteNote,getNotes,getNoteById } = require("../controllers/notesController");

const router = express.Router();


router.post("/notes", authenticate, authorizeAdmin, createNote);
router.get("/notes", authenticate, getNotes);
router.get("/notes/subject/:subject", authenticate, getNotesBySubject);
router.get("/notes/:id",  getNoteById);
router.put("/notes/:id", authenticate, authorizeAdmin, editNote);
router.delete("/notes/:id", authenticate, authorizeAdmin, deleteNote);

module.exports = router; // 🔥 export the router