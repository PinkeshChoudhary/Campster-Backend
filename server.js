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
const eventRoute = require("./Routes/eventRoute");
const contactRoute = require("./Routes/contactRoute");
const communityChatRoute = require("./Routes/communityChatRoute");
const bingoGameRoute = require("./Routes/bingoRoute");
const blogRoutes = require('./Routes/blogRoutes')
const generativeRoute = require('./Routes/generativeRoute')
const audioRoute = require('./Routes/audioRoute')





// const ticketRoutes = require("./Routes/ticketRoute");

const { setSocket } = require("./controllers/bookingControllers"); // Import setSocket
// require("./jobs/stockRestore");


dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [`${process.env.CLIENT_URL}`],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'FETCH', 'PATCH'],
    credentials: true,
  },
});

// Pass the Socket.io instance to the booking controller
setSocket(io);

connectDB();

// Middleware
app.use(express.json({ limit: '200mb' }));
app.use(cors({ origin: `${process.env.CLIENT_URL}`, methods: ["GET", "POST", "PATCH", "PUT", "DELETE"] }));

// Routes
app.use("/api", userRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/adminfire", adminFireRoute)
app.use("/api/admin", adminRoutes);
app.use("/api/tents", tentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/glamping", glampingRoute);
app.use("/api/events", eventRoute);
app.use("/api/contact", contactRoute);
app.use("/api/citychat", communityChatRoute);
app.use("/api/bingo", bingoGameRoute);
app.use('/api/blogs', blogRoutes)
app.use('/api/travel-plan', generativeRoute)
app.use('/api/audio-stories', audioRoute)




// app.use("/api/tickets", ticketRoutes);

io.on("connection", (socket) => {
  console.log(`⚡ New client connected: ${socket.id}`);
  
  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
