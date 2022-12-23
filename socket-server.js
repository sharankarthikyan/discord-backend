const serverStore = require("./server-store");

const authSocket = require("./middlewares/auth-socket");
const newConnectionHandler = require("./socket-handlers/new-connection.handler");
const directChatHistoryHandler = require("./socket-handlers/direct-chat-history.handler");
const directMessageHandler = require("./socket-handlers/direct-message.handler");
const disconnectHandler = require("./socket-handlers/disconnect.handler");
const roomCreateHandler = require("./socket-handlers/room-create.handler");
const roomJoinHandler = require("./socket-handlers/room-join.handler");
const roomLeaveHandler = require("./socket-handlers/room-leave.handler");
const roomInitializeConnectionHandler = require("./socket-handlers/room-initialize-connection.handler");
const roomSignalingDataHandler = require("./socket-handlers/room-signaling-data.handler");

const registerSocketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  serverStore.setSocketServerInstance(io);

  // decoding and attaching the user, who raised the request from client.
  // After this layer, you can access the user data using `socket.user`
  io.use((socket, next) => {
    authSocket(socket, next);
  });

  const emitOnlineUsers = () => {
    const onlineUsers = serverStore.getOnlineUsers();
    io.emit("online-users", { onlineUsers });
  };

  io.on("connection", (socket) => {
    console.log("user connected");

    newConnectionHandler(socket, io);
    emitOnlineUsers();

    socket.on("direct-message", (data) => {
      directMessageHandler(socket, data);
    });

    socket.on("direct-chat-history", (data) => {
      directChatHistoryHandler(socket, data);
    });

    socket.on("room-create", () => {
      roomCreateHandler(socket);
    });

    socket.on("room-join", (data) => {
      roomJoinHandler(socket, data);
    });

    socket.on("room-leave", (data) => {
      roomLeaveHandler(socket, data);
    });

    socket.on("conn-init", (data) => {
      roomInitializeConnectionHandler(socket, data);
    });

    socket.on("conn-signal", (data) => {
      roomSignalingDataHandler(socket, data);
    });

    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, 1000 * 8);
};

module.exports = {
  registerSocketServer,
};
