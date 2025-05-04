import sendEmail from "../services/mailService.js";
import generateToken from "../utils/generateToken.js";
import tokenRepo from "../repos/tokenRepo.js";
import userRepo from "../repos/userRepo.js";
import userService from "../services/userService.js";
import AuthService from "../services/authService.js";
import verficationToken from "../models/verficationToken.js";
import refreshTokenRepo from "../repos/refreshTokenRepo.js";
import { client } from "../config/redis-connection.js";
import { UAParser } from "ua-parser-js";
import bcrypt from 'bcrypt';
import { version } from "mongoose";
// Models
import friendShip from "../models/friends.js";
import Requests from "../models/requests.js";

// Notification Publisher
import {notificationService} from "../services/notificationService.js";
import notifications from "../models/notifications.js";

class UserController {
    async handleLogin(req , res) {
        try{
            const {email , password , remember} = req.body;
            // console.log(email , password);
            const {token , user , refreshToken} = await AuthService.login(email , password , remember);

            res.cookie("token", token, {
                httpOnly: true, // Prevent JavaScript access (XSS protection)
                secure: process.env.NODE_ENV === "production", // Use secure cookies in production
                sameSite: "Strict",
            });

            res.cookie("refreshtoken", refreshToken, {
                httpOnly: true, // Prevent JavaScript access (XSS protection)
                secure: process.env.NODE_ENV === "production", // Use secure cookies in production
                sameSite: "Strict",
                maxAge: (remember?7:1) * 24 * 60 * 60 * 1000,
            });

             const parser = new UAParser(req.headers['user-agent']);

             const userAgent = parser.getResult();

            // console.log(parser.getResult());

            await refreshTokenRepo.insertToken(user._id, refreshToken, req.ip || req.connection.remoteAddress , {
                ua: userAgent.ua,
                browser: {
                    name: userAgent.browser.name,
                    version: userAgent.browser.version,
                    major: userAgent.browser.major
                },
                engine: {
                    name: userAgent.engine.name,
                    version: userAgent.engine.version
                },
                os: {
                    name: userAgent.os.name,
                    version: userAgent.os.version
                }
            })

            res.json({success: true , token});

        }
        catch(err){
            res.status(500).send({
                message: "We couldn't authenticate your request. Please try again later.",
                error: err.message,
                success: false,
            })
        }
    }

    async handleRegister(req, res) {
        try {
            const { username, usermail, password, repeatPassword } = req.body;
            // Register Logic
            const user = await AuthService.register(username, usermail, password);
            if (!user) {
                return res.status(500).send({ message: 'Error while registering the user' });
            }

            // console.log('User Added in the DB:', user)
            const token = generateToken();

            const fullUrl = req.protocol + '://' + req.get('host');


            // Send verification Email
            if (!sendEmail(usermail, 'Confirm Your Account' , 'email-verification', `${fullUrl}/verify/${user._id}?token=${token}`)) {

                const delUser = await user.findOneAndDelete(user._id);
                console.log(delUser);
                return res.status(400).send({ message: "❌ Oops! We couldn't send the verification email. Please check your email address and try again, or contact support for assistance." });
            }

            console.log('Verification Token: ', token);
            tokenRepo.insertToken(user._id, token);

            res.status(200).send({success: true, data: { token, user: user._id.toString() }, message: "📩 We've sent you a verification email! Please check your inbox and follow the link to verify your account. Didn’t receive it? Check your spam folder or resend the email." });

        }
        catch (err) {
            console.log("Registration Error: " , err);
            res.status(500).send({
                message: "An unexpected error occurred during registration. Please try again later.",
                error: err.message,
                success: false,
            })
        }
    }

    async handleLogout(req , res , next) {
        try{
            const token  = req.cookies.token;
            const refreshToken = req.cookies.refreshtoken;
            if(!token) throw new Error("Invalid Request!");
            const decoded = await AuthService.verifyToken(token);
            await AuthService.invalidateToken(token);
            res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });
            await AuthService.invalidateToken(refreshToken , 'refresh');
            res.clearCookie("refreshtoken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });

            //Delete Token From DB
            await refreshTokenRepo.deleteToken(decoded.userId);

            res.render('pages/login' , {message: 'You have been successfully logged out!'});
        }
        catch(e){
            return next({
                status: 400,
                title: "Invalid Request",
                message: e.message,
            });
        }
    }

    async resetPassword(req , res) {
        try{
            const {password , repeatPassword , requestID, token} = req.body;
            if(password !== repeatPassword) throw new Error("Password mismatched!");

            if(!password || !repeatPassword || !requestID || !token)
                throw new Error('Invalid Request! Please try again');

            const TOKEN = await verficationToken.findOne({userId: requestID , token , type: 'passwordReset'});
            if(!TOKEN) throw new Error('Invalid Request token');

            const hashedPassword = await bcrypt.hash(password, 10);

            await userRepo.updateUser(TOKEN.userId , {password: hashedPassword});

            res.status(200).send({success: true, message: 'Your password has been reset. <a href="/login">LOGIN</a>'})
        }
        catch(err){
            res.status(500).send({
                success: false,
                error: err.message
            })
        }
    }

    async handleResetPasswordRequest(req , res){
        try{
            const {email} = req.body;
            if(!email) throw new Error('Email is required!');

            const user = await userRepo.findUserByEmail(email);
            console.log(user);

            if(!user) throw new Error('No Account Found!');

            const token = generateToken();

            const fullUrl = req.protocol + '://' + req.get('host');


            // Send verification Email
            if (!sendEmail(email, 'Reset Your Password!' , 'reset-password', `${fullUrl}/reset-password/${user._id}?token=${token}`)) {
                return res.status(400).send({ message: "❌ Oops! We couldn't send the verification email. Please check your email address and try again, or contact support for assistance." });
            }

            await tokenRepo.insertToken(user._id , token , 'passwordReset');

            res.status(200).send({success: true , message: "📩 We've email you a password resend link! Please check your inbox and follow the link to verify your account. Didn’t receive it? Check your spam folder or resend the email."})

        }
        catch(err){
            res.status(500).send({
                success: false,
                error: err.message
            })
        }
    }

    async search(req , res){
        try {
            const { q } = req.query;
            const query = {};
        
            if (q) {
              query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
              ];
            }
        
            const users = await User.find(query);
        
            res.json(users);
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
    }

    forgotPassword() {

    }

    resendMail(req, res) {

    }

    dashboard(req , res){

    }

}

export default new UserController();