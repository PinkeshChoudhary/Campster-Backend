const express = require('express');
const router = express.Router();
const { upload, todayvibeUpload, audioUpload } = require('../config/multerg');
const { addPlace, listPlaces,  placebyid, likePlace, getComments, addComment, getPostByUserId, getLikes, listPlaceCity, uploadTodaysVibe } = require('../controllers/placecontrollers');

// Add a new post
router.post('/submit', upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'images', maxCount: 8 }
]), addPlace);

// Get all approved posts
router.get('/', listPlaces);
router.get('/location', listPlaceCity);


router.get('/:id', placebyid);

 // Like a post
router.post("/like/:placeId", likePlace);
router.get('/:id/likes', getLikes);
router.post('/:id/comments', addComment);
router.get('/:id/comments', getComments);

router.get("/user/:userId", getPostByUserId);

router.post('/:id/todays-vibe', todayvibeUpload.single('media'), uploadTodaysVibe);


module.exports = router;
