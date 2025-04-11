const express = require("express");
const router = express.Router();
const upload = require('../config/multerg');
const {
  getAllGames,
  getGameById,
  joinGame,
  submitTaskProof,
  verifyTask,
  sendChatMessage,
  getChatMessages,
} = require("../controllers/bingoController");

router.get("/", getAllGames);
router.get("/:gameId", getGameById);
router.post("/join", joinGame);
router.post("/:gameId/tasks/:row/:col/submit",  upload  .array('images', 8), submitTaskProof);
router.post("/:gameId/tasks/:row/:col/verify", verifyTask);
router.post("/:gameId/chat", sendChatMessage);
router.get("/:gameId/chat", getChatMessages);

module.exports = router;
