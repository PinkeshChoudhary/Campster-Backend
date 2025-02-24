const express = require('express');
const { verifyAdmin } = require('../middleware/adminMiddleware');
const router = express.Router();

router.get('/dashboard', verifyAdmin, (req, res) => {
  res.json({ message: '' , isAdmin: req.user.isAdmin });
});

module.exports = router;
