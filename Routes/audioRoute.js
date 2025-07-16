const express = require('express');
const router = express.Router();
const { audioUpload } = require('../config/multerg');

const {
  uploadAudioStory,
   getAudioStories,
   getSingleAudioStory,
   deleteAudioStory,
} = require("../controllers/audioBlogController");

router.post('/', audioUpload.single('audio'), uploadAudioStory);
router.get('/', getAudioStories);
router.get('/:id', getSingleAudioStory);
router.delete('/:id', deleteAudioStory);

module.exports = router;