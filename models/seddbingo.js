const mongoose = require("mongoose");
const dotenv = require("dotenv");
const BingoGame = require("./bingoGame.js");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("✅ Connected to MongoDB");

  const sampleTasks = [
    "Take a selfie near a campfire",
    "Sing a song at the tent",
    "Watch the sunset",
    "Climb a tree",
    "Cook something outdoors",
    "Swim in a lake",
    "Spot a wild animal",
    "Build a shelter",
    "Collect firewood",
    "Dance around a fire",
    "Capture the night sky",
    "Ride a bicycle",
    "Meditate in the forest",
    "Explore a cave",
    "Find a waterfall",
    "Sleep under the stars",
    "Tell a ghost story",
    "Roast marshmallows",
    "Try glamping",
    "Go hiking",
    "Plant a tree",
    "Play a camp game",
    "Do yoga outside",
    "Take a cold shower",
    "Help another camper"
  ];

  // Convert to 5x5 grid
  const board = [];
  for (let i = 0; i < 5; i++) {
    board.push(
      sampleTasks.slice(i * 5, i * 5 + 5).map(task => ({
        task,
        status: "open"
      }))
    );
  }

  await BingoGame.deleteMany({});
  const newGame = await BingoGame.create({
    theme: "Adventure Bingo",
    players: [],
    board,
    status: "waiting"
  });

  console.log("🎉 Game created with ID:", newGame._id);
  process.exit();
});
