const FriendInvitation = require("../../models/friend-invitation.model");

const friendsUpdates = require("../../socket-handlers/updates/friends.updates");

const postReject = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.user;

    // remove that invitation from friend invitations collection
    const invitationExists = await FriendInvitation.exists({ _id: id });

    if (invitationExists) {
      await FriendInvitation.findByIdAndDelete(id);
    }

    // update pending invitations
    friendsUpdates.updateFriendsPendingInvitations(userId);

    return res.status(200).send({ message: "Invitation succesfully rejected" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong. Please try again.", error: err });
  }
};

module.exports = postReject;
