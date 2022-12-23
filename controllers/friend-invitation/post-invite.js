const User = require("../../models/user.model");
const FriendInvitation = require("../../models/friend-invitation.model");

const friendsUpdates = require("../../socket-handlers/updates/friends.updates");

const postInvite = async (req, res) => {
  const { targetMailAddress } = req.body;

  const { userId, mail } = req.user;

  // check if friend that we would like to invite is not user
  if (mail.toLowerCase() === targetMailAddress.toLowerCase()) {
    return res
      .status(409)
      .send({ message: "Sorry, you can't become friend with yourself." });
  }

  // checking if the target email id is present in our db.
  const targerUser = await User.findOne({
    mail: targetMailAddress.toLowerCase(),
  });

  if (!targerUser) {
    return res.status(404).send({
      message: `Friend of "${targetMailAddress}" has not been found. Please check the e-mail address.`,
    });
  }

  // check if invitation has been already sent
  const invitationAlreadySent = await FriendInvitation.findOne({
    senderId: userId,
    receiverId: targerUser._id,
  });

  if (invitationAlreadySent) {
    return res
      .status(409)
      .send({ message: "Invitation has been already sent." });
  }

  // check if the user which we would like to invite is already our friend.
  const userAlreadyFriend = targerUser.friends.find(
    (friendId) => friendId.toString() === userId.toString()
  );

  if (userAlreadyFriend) {
    return res
      .status(409)
      .send({ message: "Friend already added. Please check friends list" });
  }

  // create new invitation to database
  const newInvitation = await FriendInvitation.create({
    senderId: userId,
    receiverId: targerUser._id,
  });

  // if the invitation has been successfully created, we would like to update friends invitation if other user is online
  friendsUpdates.updateFriendsPendingInvitations(targerUser._id.toString());

  return res.status(201).send({ message: "Invitation has been sent." });
};

module.exports = postInvite;
