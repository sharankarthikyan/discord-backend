const serverStore = require("../server-store");
const roomsUpdates = require("./updates/rooms.updates");

const roomCreateHandler = (socket) => {
  console.log("handling room create event");

  const socketId = socket.id;
  const userId = socket.user.userId;

  const roomDetails = serverStore.addNewActiveRoom(userId, socketId);

  socket.emit("room-create", {
    roomDetails,
  });

  roomsUpdates.updateRooms();
};

module.exports = roomCreateHandler;
