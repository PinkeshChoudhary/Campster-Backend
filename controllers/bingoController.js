const BingoGame = require("../models/bingoGame");

// GET all games
const getAllGames = async (req, res) => {
  try {
    const games = await BingoGame.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch games" });
  }
};

// GET one game by ID
const getGameById = async (req, res) => {
  try {
    const game = await BingoGame.findById(req.params.gameId);
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// JOIN a game
const joinGame = async (req, res) => {
  const { playerName } = req.body;

  try {
    // STEP 1: Check if the player is already in a game
    const existingGame = await BingoGame.findOne({ "players.name": playerName });
console.info('user exist run ', existingGame)
    if (existingGame) {
      const player = existingGame.players.find((p) => p.name === playerName);
      return res.json({ gameId: existingGame._id, playerId: player._id });
    }

    // STEP 2: Join the only waiting game (if it exists and has space)
    const waitingGame = await BingoGame.findOne({ status: "waiting" });
console.info('waitingGame run ', waitingGame)


    if (waitingGame && waitingGame.players.length < 2) {
      const newPlayer = { name: playerName };
      waitingGame.players.push(newPlayer);

      if (waitingGame.players.length === 2) {
        waitingGame.status = "active";
      }

      await waitingGame.save();

      const player = waitingGame.players.find((p) => p.name === playerName);
      return res.json({ gameId: waitingGame._id, playerId: player._id });
    }

    // STEP 3: No waiting games — clone last game board and reset all tasks
    const lastGame = await BingoGame.findOne().sort({ createdAt: -1 });
    console.info('lastGame run ', lastGame)

    if (!lastGame) {
      return res.status(404).json({ error: "No base game found" });
    }

    const freshBoard = lastGame.board.map((row) =>
      row.map((task) => ({
        task: task.task,
        status: "open",
        proofPhoto: "",
        submittedBy: "",
        verifiedBy: "",
      }))
    );

    const newGame = new BingoGame({
      theme: lastGame.theme,
      board: freshBoard,
      players: [{ name: playerName }],
      status: "waiting",
    });

    await newGame.save();

    const player = newGame.players.find((p) => p.name === playerName);
    return res.json({ gameId: newGame._id, playerId: player._id });

  } catch (error) {
    console.error("Join game failed", error);
    res.status(500).json({ error: "Failed to join game" });
  }
};

  
  
  
  
// POST /api/bingo/:gameId/tasks/:row/:col/submit
const submitTaskProof = async (req, res) => {
    const imageUrls = req.files.map(file => file.path);
    console.info('imageurl', imageUrls )
    const { gameId, row, col } = req.params;
    const { playerId } = req.body;
  
    try {
      const game = await BingoGame.findById(gameId);
      if (!game) return res.status(404).json({ error: "Game not found" });
  
      const task = game.board[row][col];
  
      if (task.status !== "open") {
        return res.status(400).json({ error: "Task already submitted or completed" });
      }
  
      // Store selfie and mark pending
      task.status = "pending";
      task.proofPhoto = imageUrls;
      task.submittedBy = playerId;
  
      await game.save();
      res.json({ message: "Proof submitted", task });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error submitting task proof" });
    }
  };

  // POST /api/bingo/:gameId/tasks/:row/:col/verify
const verifyTask = async (req, res) => {
    const { gameId, row, col } = req.params;
    const { verifierId } = req.body;
  
    try {
      const game = await BingoGame.findById(gameId);
      if (!game) return res.status(404).json({ error: "Game not found" });
  
      const task = game.board[row][col];
  
      if (task.status !== "pending") {
        return res.status(400).json({ error: "Task is not pending for verification" });
      }
  
      // Optional: prevent same player from verifying their own task
      if (task.submittedBy === verifierId) {
        return res.status(403).json({ error: "You cannot verify your own task" });
      }
  console.info('tast', task.status )
      task.status = "approved";
      task.verifiedBy = verifierId;
  
      await game.save();
      res.json({ message: "Task verified successfully", task });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error verifying task" });
    }
  };

  // GET chat messages for a game
  const getChatMessages = async (req, res) => {
    try {
      const game = await BingoGame.findById(req.params.gameId);
      if (!game) return res.status(404).json({ message: "Game not found" });
  
      res.json(game.chat || []);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const sendChatMessage = async (req, res) => {
    const { sender, message } = req.body;
  
    if (!sender || !message) {
      return res.status(400).json({ message: "Sender and message are required" });
    }
  
    try {
      const game = await BingoGame.findById(req.params.gameId);
      if (!game) return res.status(404).json({ message: "Game not found" });
  
      const newMessage = {
        sender,
        message,
        timestamp: new Date(),
      };
  
      game.chat = game.chat || [];
      game.chat.push(newMessage);
      await game.save();
  
      res.status(201).json(newMessage); // return saved message
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  

module.exports = {
  getAllGames,
  getGameById,
  joinGame,
  submitTaskProof,
  verifyTask,
  getChatMessages,
  sendChatMessage,
};
