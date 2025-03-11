import sendEmail from "../services/mailService.js";
import generateToken from "../utils/generateToken.js";
import tokenRepo from "../repos/tokenRepo.js";
import userRepo from "../repos/userRepo.js";
import userService from "../services/userService.js";
import AuthService from "../services/authService.js";

class UserController {
    async handleLogin(req , res) {
        try{
            const {email , password} = req.body;
            // console.log(email , password);
            const {token , user} = await AuthService.login(email , password);

            res.cookie("token", token, {
                httpOnly: true, // Prevent JavaScript access (XSS protection)
                secure: process.env.NODE_ENV === "production", // Use secure cookies in production
                sameSite: "Strict",
            });
            res.setHeader("access_token" , token);

            res.json({token});

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
            if (!sendEmail(usermail, `${fullUrl}/verify/${user._id}?token=${token}`)) {

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
            if(!token) throw new Error("Invalid Request!");
            await AuthService.invalidateToken(token);
            res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
            // res.json({success: true, message: "Logged out successfully!" });
            res.render('pages/login' , {message: 'You have been successfully logged out!'});
        }
        catch(e){
            return next({
                status: 400,
                title: "Invalid Request",
                message: e.message,
            });
            //res.status(500).json({success:false , message: e.message});
        }
    }

    resetPassword() {

    }


    forgotPassword() {

    }

    resendMail(req, res) {

    }

    dashboard(req , res){

    }

}

export default new UserController();