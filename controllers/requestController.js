// Dependencies
import Requests from "../models/requests.js";
import notifications from "../models/notifications.js";
import userRepo from "../repos/userRepo.js";
import { notificationService } from "../services/notificationService.js";


// Class FriendController
class RequestController {

    async sendChallenge(req, res) {
        const { to } = req.body;
        // console.log(req.user, to);
        try {
            const user = await userRepo.findUserByEmail(req.user.email);
            const friend = await userRepo.findUserByEmail(to);


            const request = await Requests.create({
                requester: user._id,
                recipent: friend._id,
                type: "challenge",
            });

            const noti = await notifications.create({
                userId: friend._id,
                requestId: request._id,
                type: "challenge",
                title: `${user.name}`,
                message: `You've been challenged!`,
            });
            noti.to = friend.email;

            console.log("Challenege Notification:", noti);


            await notificationService.send(
                noti,
                { actions: ["accept", "reject"] }
            );
            res.status(200).send({
                success: true,
                message: `Challenge has been sent to <b>${friend.name}</b>`,
            });
        } catch (e) {
            // console.log(e);
            res.status(500).send({
                success: false,
                message: `${e.message}`,
            });
        }
    }

    async cancelChallenge(req, res) {

    }

    async rejectChallenge(req, res) {
        // console.log('Accept Challenge:' , req.body);
            const { _id, userId, type, requestId } = req.body;
        
            try {
              // Mark status as Read (Maybe deleted)
              await notifications.findOneAndUpdate(
                { _id, userId: req.user._id, type },
                { status: "read" }
              );
        
             
              // Update Request status
              const request = await Requests.findOneAndUpdate(
                { _id: requestId, recipent: req.user._id },
                { status: "Approved" },
                {new: true}
              );

              const requester = await userRepo.findUserById(request.requester);
        
              // Publish notification
              await notificationService.send({
                to: requester.email,
                title: req.user.displayName,
                message: `Decline your challenge!`,
                type: "info"
            });
        
              // Send Response
              res.status(200).send({
                success: true,
                message: "Challenge Rejected!",
              });
            } catch (e) {
                console.log(e);
              res.status(500).send({
                success: false,
                message: e.message || "Unknow Error while accepting request",
              });
            }
    }

    async acceptChallenge(req, res) {
        console.log('Accept Challenge:' , req.body);
            const { _id, userId, type, requestId } = req.body;
        
            try {
              // Mark status as Read (Maybe deleted)
              await notifications.findOneAndUpdate(
                { _id, userId: req.user._id, type },
                { status: "read" }
              );
        
             
              // Update Request status
              const request = await Requests.findOneAndUpdate(
                { _id: requestId, recipent: req.user._id },
                { status: "Approved" },
                {new: true}
              );

              const requester = await userRepo.findUserById(request.requester);
        
              // Publish notification
              await notificationService.send({
                to: requester.email,
                title: req.user.displayName,
                message: `Accepted your challenge!`,
                type: "info"
            });
        
              // Send Response
              res.status(200).send({
                success: true,
                message: "Challenge Accepted!",
              });
            } catch (e) {
                console.log(e);
              res.status(500).send({
                success: false,
                message: e.message || "Unknow Error while accepting request",
              });
            }
    }

}

export default new RequestController();
