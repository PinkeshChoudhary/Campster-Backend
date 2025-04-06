const express = require("express");
const router = express.Router();
const {
  getMessagesByCity,
  sendMessage,
  replyToMessage
} = require('../controllers/communityChatController.js')

router.get('/:city', getMessagesByCity)
router.post('/', sendMessage)
router.post('/reply/:messageId', replyToMessage)

module.exports = router;
