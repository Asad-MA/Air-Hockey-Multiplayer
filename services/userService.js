
import tokenRepo from "../repos/tokenRepo.js";
import userRepo from "../repos/userRepo.js";
import bcrypt from 'bcrypt';

class UserService{
    login(){

    }

   async register(name , email , password){

        // Register Logic
        try{
        const existingUser = await userRepo.findUserByEmail(email);
        if (existingUser) throw new Error("Email already in use!");

        const hashedPassword = await bcrypt.hash(password, 10);
        return await userRepo.createUser(name, email, hashedPassword);
        }
        catch(err){
            console.log(err);
            return false;
        }
    }

    logout(){

    }

    resetPassword(){

    }

    verifyEmail(){

    }

    forgotPassword(){

    }
}

export default new UserService();