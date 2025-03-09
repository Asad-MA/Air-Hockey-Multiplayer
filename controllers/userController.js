import sendEmail from "../services/mailService.js";
import generateToken from "../utils/generateToken.js";
import tokenRepo from "../repos/tokenRepo.js";
import userService from "../services/userService.js";

class UserController{
    login(){

    }

   async handleRegister(req , res){
        const {username , usermail , password } = req.body;    
        // Register Logic
       const user = await userService.register(username , usermail , password);
        if(!user) res.status(500).send({message: 'Error while registering the user'});





        const token = generateToken();
        console.log('Verification Token: ' , token);
        tokenRepo.insertToken(user._id , token);
        // Send verification Email
       if( !sendEmail("asadorasoo32@gmail.com", `http://localhost/verify/${user._id}?token=${token}`))
        res.send("Email not Sent");


        res.send("Email Has been sent sucessfully");
    }

    logout(){

    }

    resetPassword(){

    }

   
    forgotPassword(){

    }


}

export default new UserController();