const express = require('express');
const router = express.Router();
const upload = require('../config/multerg');
const todayvibeUpload = require('../config/multerg');
const { addPlace, listPlaces, placebyid, likePlace, getComments, addComment, getPostByUserId, getLikes, listPlaceCity, uploadTodaysVibe, getActiveTodaysVibes, manualCleanupTodaysVibe, getTodaysVibe } = require('../controllers/placecontrollers');

// Add a new post
router.post('/submit', upload.array('images', 8), addPlace);

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

// TodaysVibe routes
router.post('/:id/todays-vibe', todayvibeUpload.single('media'), uploadTodaysVibe);
router.get('/:id/todays-vibe', getTodaysVibe);
router.get('/todays-vibes/active', getActiveTodaysVibes);
router.post('/todays-vibes/cleanup', manualCleanupTodaysVibe);

module.exports = router;
