const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("morgan");
require("dotenv").config();

// Socket Server
const socketServer = require("./socket-server");

// Routes
const authRoutes = require("./routes/auth.routes");
const friendInvitationRoutes = require("./routes/friend-invitation.routes");

// PORT configuration
const PORT = process.env.PORT || process.env.API_PORT;

// Express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(logger("dev"));

// Register the routes
app.use("/api/auth", authRoutes);
app.use("/api/friend-invitation", friendInvitationRoutes);

// Creating http server
const server = http.createServer(app);

socketServer.registerSocketServer(server);

// listening on port
// Pass second param as process.env.EXPRESS_PRIVATE_IP
server.listen(PORT, () => console.log(`server listening at ${PORT}`));

mongoose.connect(
  `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongodb:27017/course-goals?authSource=admin`,
  // `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.qx1mfzq.mongodb.net/?retryWrites=true&w=majority`,
  // `mongodb://localhost:27017/?authSource=admin`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error("FAILED TO CONNECT TO MONGODB");
      console.error(err);
    } else {
      console.log("CONNECTED TO MONGODB");
      app.listen(80);
    }
  }
);
