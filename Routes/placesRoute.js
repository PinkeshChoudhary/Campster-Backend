const express = require('express');
const router = express.Router();
const upload = require('../config/multerg');
const { addPlace, listPlaces, likePlace, commentOnPlace, placebyid } = require('../controllers/placecontrollers');

// Add a new place
router.post('/submit', upload.array('images', 8), addPlace);

// Get all approved places
router.get('/', listPlaces);

// Like a place
router.post('/like/:id', likePlace);

// Comment on a place
router.post('/comment/:id', commentOnPlace);

router.get('/:id', placebyid);

module.exports = router;
