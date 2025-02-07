const express = require('express');
const router = express.Router();
const { approvePlace, getPendingPlaces, rejectPlace, loginAdmin } = require('../controllers/admincontrollers');
const { protectAdmin } = require('../middleware/auth');


router.post('/login', loginAdmin);

// Route to get all unapproved places
router.get('/pending-places', protectAdmin, getPendingPlaces);

// Route to approve a place
router.post('/approve-place/:id', protectAdmin, approvePlace);

// Route to reject (delete) a place
router.delete('/reject-place/:id', protectAdmin,  rejectPlace);

module.exports = router;