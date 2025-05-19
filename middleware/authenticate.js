import refreshTokenRepo from "../repos/refreshTokenRepo.js";
import AuthService from "../services/authService.js";
import {StrToTime , timeToStr} from '../utils/humanReadableDate.js'
import { UAParser } from 'ua-parser-js';

const authenticate = async (req, res, next) => {
    const { token, refreshtoken } = req.cookies;
    try {
        if (!token || !refreshtoken) throw new Error('Invalid Tokens!');
        const user = await AuthService.verifyToken(token);
        // console.log('Token verification case1' , user);
        req.user = {_id: user.userId ,  name: user.name, displayName: user.displayName, email: user.email , token: token, avatar: user.avatar}
        next();
    }
    catch (err) {
        console.log("Unauthorized Access Token: ", err.message);

        try {
            if (!refreshtoken) throw new Error('No Refresh Token is given');

            // If have refresh token
            const storedToken = await refreshTokenRepo.findToken({ token: refreshtoken, ip: req.ip || req.connection.remoteAddress });



            // console.log(refreshtoken);

            //fetch for Database


            // Validates the device

            const parser = new UAParser(req.headers['user-agent']);

            const userAgent = parser.getResult();

          // console.log(parser.getResult());

            const isBrowserMatch = JSON.stringify(storedToken.userAgent.browser) === JSON.stringify(userAgent.browser);
            const isOSMatch = JSON.stringify(storedToken.userAgent.os) === JSON.stringify(userAgent.os);

            //Validate the Refresh Token Here;

            if (!isBrowserMatch || !isOSMatch) throw new Error('Device Change detected!');


            // IF valid 
            // Generate new access token 
            const { token, refreshToken } = await AuthService.refreshToken(storedToken.token);

            // console.log(
            //     'Access Token:', token,
            //     '\n',
            //     'RefreshTOken: ', refreshToken
            // );

            
            const user = await AuthService.verifyToken(refreshToken , 'refresh');

            // console.log('Decoded Refresh Token:' , user);

            //  console.log(new Date(user.exp) , new Date(user.exp * 1000));

            // set new cookie token
            res.cookie("token", token, {
                httpOnly: true, // Prevent JavaScript access (XSS protection)
                secure: process.env.NODE_ENV === "production", // Use secure cookies in production
                sameSite: "Strict",
            });

            res.cookie("refreshtoken", refreshToken, {
                httpOnly: true, // Prevent JavaScript access (XSS protection)
                secure: process.env.NODE_ENV === "production", // Use secure cookies in production
                sameSite: "Strict",
                maxAge: StrToTime(timeToStr(user.exp))  //Here it will convert JWT expiry to milliseconds
            });

            await refreshTokenRepo.deleteToken(storedToken.userId);

            await refreshTokenRepo.insertToken(storedToken.userId, refreshToken, req.ip || req.connection.remoteAddress, {
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

            // console.log('Inserted new Refresh token!');

            // call next() 
            // console.log(user);
            req.user = { _id: user._id , name: user.name, displayName: user.displayName, email: user.email , token: token ,  avatar: user.avatar}

            next();
            //If invalid

            //clear refresh token cookie

            //redirect to login page
        }

        catch (err) {
            console.log('UnAuthorized All Token! ', err.message);
            res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });
            res.clearCookie("refreshtoken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });

            return res.status(401).redirect('/login');
        }



    }
}


export default authenticate;