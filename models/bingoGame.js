const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  task: String,
  proofPhoto: {
    type: [String], 
    required: true,
  },
  submittedBy: String,
  verifiedBy: String,
  status: {
    type: String,
    enum: ["open", "pending", "approved", "rejected"],
    default: "open",
  },
});
const ChatMessageSchema = new mongoose.Schema({
    sender: {
      type: String, // can be socket id or player name/id
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });

const BingoGameSchema = new mongoose.Schema({
  theme: String,
  players: [
    {
      name: String,
    },
  ],
  board: [[TaskSchema]],
  chat: [ChatMessageSchema],
  status: {
    type: String,
    enum: ["waiting", "active", "finished"],
    default: "waiting",
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("BingoGame", BingoGameSchema);
