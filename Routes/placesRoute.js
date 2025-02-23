const express = require('express');
const router = express.Router();
const upload = require('../config/multerg');
const { addPlace, listPlaces,  placebyid, likePlace, getComments, addComment, getPostByUserId, getLikes } = require('../controllers/placecontrollers');

// Add a new post
router.post('/submit', upload.array('images', 8), addPlace);

// Get all approved posts
router.get('/', listPlaces);

router.get('/:id', placebyid);

 // Like a post
router.post("/like/:placeId", likePlace);
router.get('/:id/likes', getLikes);
router.post('/:id/comments', addComment);
router.get('/:id/comments', getComments);

router.get("/user/:userId", getPostByUserId);

module.exports = router;
