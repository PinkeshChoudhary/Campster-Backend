const express = require("express");
const router = express.Router();
const { getEvent, addEvent, deleteEvent, getEventbyid, verifiyEvent, getCategories } = require("../controllers/eventController.js");
const upload = require("../config/multerg");

// Get all glamping sites
router.get("/", getEvent);
router.get("/categories", getCategories);

router.get('/:id', getEventbyid);

// Add a new glamping site
router.post("/submit",  upload  .array('images', 8), addEvent);

// Delete a glamping site
router.delete("/:id", deleteEvent);

router.post('/:id', verifiyEvent);


module.exports = router;
