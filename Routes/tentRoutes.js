const express = require("express");
const router = express.Router();
const { getAvailableTents } = require("../controllers/tentControllers");

// Get available tents
router.get("/available", getAvailableTents);

module.exports = router;
