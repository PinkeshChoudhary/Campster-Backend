const express = require("express");
const router = express.Router();
const { getGlampingSites, addGlampingSite, deleteGlampingSite, glampingsitebyid, getTypeOfStay } = require("../controllers/glampingController");
const upload = require("../config/multerg");

// Get all glamping sites
router.get("/", getGlampingSites);

router.get("/typeOfStay", getTypeOfStay);


router.get('/:id', glampingsitebyid);

// Add a new glamping site
router.post("/submit",  upload  .array('images', 8), addGlampingSite);

// Delete a glamping site
router.delete("/:id", deleteGlampingSite);

module.exports = router;
