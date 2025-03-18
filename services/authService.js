import dotenv from 'dotenv';
import path from 'path';
import userRepo from "../repos/userRepo.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import BlacklistedToken from '../models/blacklistToken.js';



dotenv.config({ path: path.join("./config/", ".env") });
class AuthService{
    constructor(){
        this.accessSecret = process.env.JWT_ACCESS_SECRET;
        this.refreshSecret = process.env.JWT_REFRESH_SECRET;
    }
    async verifyToken(token){
        // Refresh Token + Access token 

        // try {
        //     const blacklisted = await BlacklistedToken.findOne({ token });
        //     if (blacklisted) {
        //         console.log("Token is blacklisted!");
        //         throw new Error("Token has been blacklisted!");
        //     }
    
            
                return jwt.verify(token, this.accessSecret);
            // } catch (err) {
            //     // console.log(err);
            //     throw new Error(err.message || "Invalid or expired token!");
            // }
    }

    refreshToken(){

    }

    generateToken(){
        
    }

    async login(email , password){

        const user = await userRepo.findUserByEmail(email);
        if(!user) throw new Error("Email doesn't exist!");

        if(!user.isVerified) {
            
            throw new Error("Verify your email!<br>Check your inbox and click the link to activate your account.");
        }
           

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials!");

        const token = jwt.sign({ userId: user._id,name: user.name, email: user.email }, this.accessSecret, { expiresIn: "15m" });

       

        return { token, user };
    }

   async register(name , email , password){

        // Register Logic
       
        const existingUser = await userRepo.findUserByEmail(email);
        if (existingUser) throw new Error("Email already in use!");

        const hashedPassword = await bcrypt.hash(password, 10);
        return await userRepo.createUser(name, email, hashedPassword);
       
    }

    async invalidateToken(token){
        const decoded = jwt.verify(token, this.accessSecret);
        const expiryDate = new Date(decoded.exp * 1000); // Convert expiry to Date

        await BlacklistedToken.create({ token, expiresAt: expiryDate });
        console.log("Logout and Token is blacklisted")

        return true;
    }

}

export default new AuthService();