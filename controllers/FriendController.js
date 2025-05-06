// Dependencies
import Requests from "../models/requests.js";
import notifications from "../models/notifications.js";
import userRepo from "../repos/userRepo.js";
import friendShip from "../models/friends.js";
import { notificationService } from "../services/notificationService.js";
import { request } from "express";

// Class FriendController
class FriendController {
  async sendRequest(req, res) {
    const { to } = req.body;
    console.log(req.user, to);
    try {
      const user = await userRepo.findUserByEmail(req.user.email);
      const friend = await userRepo.findUserByEmail(to);

      const hasAlreadyFriend = await friendShip.findOne({
        requester: user._id,
        recipent: friend._id,
      });

      if (hasAlreadyFriend)
        throw new Error(
          `You have already send friend request to <b>${friend.name}</b>`
        );

      // console.log(friend._id);

      const request = await Requests.create({
        requester: user._id,
        recipent: friend._id,
        type: "friend_request",
      });

      await notifications.create({
        userId: friend._id,
        requestId: request._id,
        type: "friend_request",
        title: `${user.name}`,
        message: `Sends you friend request!`,
      });

      console.log("Request Added:", request);

      await friendShip.create({
        requester: user._id,
        recipent: friend._id,
        requestId: request._id,
      });

      await notificationService.send(
        friend.email,
        user.name,
        `Just sends you friend request`,
        "friend",
        { actions: ["accept", "reject"] }
      );
      res.status(200).send({
        success: true,
        message: `Friend request has been sent to <b>${friend.name}</b>`,
      });
    } catch (e) {
      // console.log(e);
      res.status(500).send({
        success: false,
        message: `${e.message}`,
      });
    }
  }

  async acceptRequest(req, res) {
    console.log(req.body);
    const { _id, userId, type, requestId } = req.body;

    try {
      // Mark status as Read (Maybe deleted)
      await notifications.findOneAndUpdate(
        { _id, userId: req.user._id, type },
        { status: "read" }
      );

      // Update the friendShip status
      const friendShipData = await friendShip.findOneAndUpdate(
        { recipent: req.user._id, requestId: requestId._id },
        { status: "active" },
        { new: true }
      );

      const requester = await userRepo.findUserById(friendShipData.requester);

      // Update Request status
      await Requests.findOneAndUpdate(
        { _id: requestId._id, recipent: req.user._id },
        { status: "Approved" }
      );

      // Publish notification
      await notificationService.send(
        requester.email,
        req.user.displayName,
        `Accepted your friend request!`,
        "info"
      );

      // Send Response
      res.status(200).send({
        success: true,
        message: "Request Accepted!",
      });
    } catch (e) {
      res.status(500).send({
        success: false,
        message: e.message || "Unknow Error while accepting request",
      });
    }
  }

  async rejectRequest(req, res) {
    const { _id, userId, type, requestId } = req.body;
    try {
      // Mark status as Read (Maybe deleted) (Keep if user want to revist notifications)
      await notifications.findOneAndUpdate(
        { _id, userId: req.user._id, type },
        { status: "read" }
      );

      // Update the friendShip status
      await friendShip.findOneAndDelete({
        recipent: req.user._id,
        requestId: requestId._id,
      });

      // Update Request status
      await Requests.findOneAndUpdate(
        { _id: requestId._id, recipent: req.user._id },
        { status: "Rejected" }
      );

      // Publish notification
      await notificationService.send(
        req.user.email,
        req.displayName.name,
        `Decline your friend request!`,
        "info"
      );

      // Send Response
      res.status(200).send({
        success: true,
        message: "Request Rejected!",
      });
    } catch (e) {
      res.status(500).send({
        success: false,
        message: e.message || "Unknow Error while rejecting request",
      });
    }
  }

  async getFriends(req, res) {
    try {
      const { _id } = req.user;
      // Get accepted friendships involving the user
      const friendships = await friendShip
        .find({
          $or: [{ requester: _id }, { recipent: _id }],
          status: "active",
        })
        .populate("requester recipent", "name displayName email");

      const friends = friendships.map((f) => {
        const requester = f.requester;
        const recipient = f.recipent;

        // Return the user that is not `userId`
        return requester._id.toString() === _id.toString()
          ? recipient
          : requester;
      });

      console.log(`Friends of ${req.user.displayName} : `, friends);

      res.status(200).send({
        success: true,
        friends: friends,
      });
    } catch (e) {
        req.status(500).send({
            success: false,
            message: e.message 
        })
    }
  }
}

export default new FriendController();
