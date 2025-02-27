const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const placeRoutes = require("./Routes/placesRoute");
const adminRoutes = require("./Routes/adminRoute");
const userRoutes = require("./Routes/user");
const tentRoutes = require("./Routes/tentRoutes");
const bookingRoutes = require("./Routes/bookingRoutes");
const adminFireRoute = require("./Routes/adminFireRoute");
const glampingRoute = require("./Routes/glampingRoute");

const { setSocket } = require("./controllers/bookingControllers"); // Import setSocket
// require("./jobs/stockRestore");


dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Pass the Socket.io instance to the booking controller
setSocket(io);

connectDB();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST", "PATCH", "PUT", "DELETE"] }));

// Routes
app.use("/api", userRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/adminfire", adminFireRoute)
app.use("/api/admin", adminRoutes);
app.use("/api/tents", tentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/glamping", glampingRoute);

io.on("connection", (socket) => {
  console.log(`⚡ New client connected: ${socket.id}`);
  
  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
