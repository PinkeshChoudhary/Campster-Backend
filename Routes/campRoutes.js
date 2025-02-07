// routes/campRoutes.js
const express = require('express');
const { getCamps, addCamp, updateCamp, deleteCamp, rentCamp } = require('../controllers/campControllers');
const { protectAdmin } = require('../middleware/auth');
const router = express.Router();

// Public routes
router.get('/', getCamps);
router.post('/rent/:id', rentCamp);

// Admin routes
router.post('/add', protectAdmin , addCamp);
router.put('/update/:id', protectAdmin,  updateCamp);
router.delete('/delete/:id', protectAdmin ,deleteCamp);

module.exports = router;