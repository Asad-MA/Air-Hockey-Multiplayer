import User from "../models/user.js";
import verficationToken from "../models/verficationToken.js";
import mongoose from "mongoose";


const verifyAccount = async (req, res, next) => {
    try{
    const userID = req.params.userId; 
    const token = req.query.token;    


    if (!userID || !token) {
       throw new Error('');
    }

    console.log("User ID:", userID);
    console.log("Token:", token);

    const TOKEN = await verficationToken.findOne({userId: userID , token});
    if(!TOKEN) throw new Error('');
    

    const verified =  await User.findOneAndUpdate({_id: userID} , {isVerified: true} , {new: true});

    if(!verified) throw new Error('');

    req.verifiedData = { userID, token }; 
    next();
}
catch(error){
    return next({
        status: 400,
        title: "Invalid Request",
        message: "We're having trouble verifying your email. Please check the link and try again.",
        suggestion: "Try requesting a new verification email."
    });
}
};


export default verifyAccount;