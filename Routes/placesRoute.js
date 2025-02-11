const express = require('express');
const router = express.Router();
const upload = require('../config/multerg');
const { addPlace, listPlaces,  placebyid } = require('../controllers/placecontrollers');

// Add a new place
router.post('/submit', upload.array('images', 8), addPlace);

// Get all approved places
router.get('/', listPlaces);

router.get('/:id', placebyid);

module.exports = router;
