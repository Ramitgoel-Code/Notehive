const express = require("express");
const { generateTrivia } = require("../controllers/triviaController.js");

const router = express.Router();

router.post("/generateTrivia", generateTrivia); // Accepts user preferences

module.exports = router;
