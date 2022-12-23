const serverStore = require("../server-store");

const roomLeaveHandler = require("./room-leave.handler");

const disconnectHandler = (socket) => {
  const activeRooms = serverStore.getActiveRooms();

  activeRooms.forEach((activeRoom) => {
    const userInRoom = activeRoom.participants.some(
      (participant) => participant.socketId === socket.id
    );

    if (userInRoom) {
      roomLeaveHandler(socket, { roomId: activeRoom.roomId });
    }
  });

  serverStore.removeConnectedUser(socket.id);
};

module.exports = disconnectHandler;
