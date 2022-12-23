const serverStore = require("../server-store");

const friendsUpdates = require("../socket-handlers/updates/friends.updates");
const roomsUpdates = require("../socket-handlers/updates/rooms.updates");

// This is the first handler which comes into picture when socket connection is established.
const newConnectionHandler = async (socket, io) => {
  const userDetails = socket.user;

  serverStore.addNewConnectedUser({
    socketId: socket.id,
    userId: userDetails.userId,
  });

  // update friends list
  friendsUpdates.updateFriends(userDetails.userId);

  // update pending friends invitation list
  friendsUpdates.updateFriendsPendingInvitations(userDetails.userId);

  setTimeout(() => {
    roomsUpdates.updateRooms(socket.id);
  }, [500]);
};

module.exports = newConnectionHandler;
