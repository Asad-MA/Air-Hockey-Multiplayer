import dotenv from 'dotenv';
import path from 'path';
import userRepo from "../repos/userRepo.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import BlacklistedToken from '../models/blacklistToken.js';
import {timeToStr} from '../utils/humanReadableDate.js'
import {UAParser} from 'ua-parser-js';

dotenv.config({ path: path.join("./config/", ".env") });

class AuthService{
    constructor(){
        this.accessSecret = process.env.JWT_ACCESS_SECRET;
        this.refreshSecret = process.env.JWT_REFRESH_SECRET;
    }
    async verifyToken(token , type="access"){
        // Refresh Token + Access token 

        const blacklisted = await BlacklistedToken.findOne({ token });
        if (blacklisted) {
            console.log("Token is blacklisted!");
            throw new Error("Token has been blacklisted!");
        }
        return jwt.verify(token, this[`${type}Secret`]);
    }

    async refreshToken(oldToken){
        const decoded = await this.verifyToken(oldToken , 'refresh');
        console.log('Refresh Decoded');
        console.log(decoded); //Error Here
        const expiry = decoded.exp;
        const newAccessToken = await this.generateToken(decoded); //timestampToHummanReadable(decoded.exp)
        const newRefreshToken = await this.generateToken(decoded , timeToStr(expiry) , 'refresh') //Exipry Issue (need to convert 10m/10d etc)

        return {token: newAccessToken , refreshToken: newRefreshToken}

    }

    async generateToken(user , expiry='5m' , type = 'access'){
        if(!user) throw new Error("Invalid Users OR Empty User Object");
        // console.log('User: ' , user);
        if(type == 'refresh') 
            return jwt.sign({ userId: user._id,name: user.name, email: user.email, type: type }, this.refreshSecret, { expiresIn:expiry });
        return jwt.sign({ userId: user._id,name: user.name, email: user.email, type: type }, this.accessSecret, { expiresIn:expiry });
    }

    async login(email , password , rememberMe = false){

        const user = await userRepo.findUserByEmail(email);
        if(!user) throw new Error("Email doesn't exist!");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials!");

        if(!user.isVerified) {
            throw new Error("Verify your email!<br>Check your inbox and click the link to activate your account.");
        }

        const token = await this.generateToken(user);

        const refreshToken = await this.generateToken(user , rememberMe?'7d':'24h' , 'refresh');

        return { token, user , refreshToken};
    }

   async register(name , email , password){

        // Register Logic
       
        const existingUser = await userRepo.findUserByEmail(email);
        if (existingUser) throw new Error("Email already in use!");

        const hashedPassword = await bcrypt.hash(password, 10);
        return await userRepo.createUser(name, email, hashedPassword);
       
    }

    async invalidateToken(token , type = 'access'){

        const decoded = jwt.verify(token, this[`${type}Secret`]);

        console.log('Decoded Token: ' , decoded);
        const expiryDate = new Date(decoded.exp * 1000); // Convert expiry to Date

        await BlacklistedToken.create({ token, expiresAt: expiryDate });
        console.log("Logout and Token is blacklisted")

        return true;
    }

}

export default new AuthService();