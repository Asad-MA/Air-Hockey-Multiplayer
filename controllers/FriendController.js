// Dependencies
import Requests from "../models/requests.js";
import notifications from "../models/notifications.js";
import userRepo from "../repos/userRepo.js";
import friendShip from "../models/friends.js";
import { notificationService } from "../services/notificationService.js";


// Class FriendController
class FriendController{
    async sendRequest(req, res){
        const {to} = req.body;
        console.log(req.user , to);
        try{
            const user =  await userRepo.findUserByEmail(req.user.email);
            const friend = await userRepo.findUserByEmail(to);

            const hasAlreadyFriend = await friendShip.findOne({requester: user._id , recipent: friend._id});

            if(hasAlreadyFriend) throw new Error(`You have already send friend request to <b>${friend.name}</b>`);

            // console.log(friend._id);

            const request = await Requests.create({requester: user._id , recipent: friend._id , type: 'friend_request'})

            await notifications.create({userId: friend._id , requestId: request._id , type:'friend_request', title: `${user.name}` , message: `Sends you friend request!`})

            console.log('Request Added:' , request);

            
            await friendShip.create({requester: user._id , recipent: friend._id , requestId: request._id});

            await notificationService.send(friend.email, user.name, `Just sends you friend request` , 'friend' , {actions: ['accept' , 'reject']});
            res.status(200).send({
                success:true,
                message: `Friend request has been sent to <b>${friend.name}</b>`
            })
        }
        catch(e){
            // console.log(e);
            res.status(500).send({
                success:false,
                message: `${e.message}`
            })
        }
        
    }

    async acceptRequest(){

    }

    async rejectRequest(){

    }
}

export default new FriendController();