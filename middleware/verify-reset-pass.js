import User from "../models/user.js";
import verficationToken from "../models/verficationToken.js";

const verifyResetPassword = async (req, res, next) => {
    try{
    const userID = req.params.userId; 
    const token = req.query.token;    


    if (!userID || !token) {
       throw new Error('');
    }

    console.log("User ID:", userID);
    console.log("Token:", token);

    const TOKEN = await verficationToken.findOne({userId: userID , token , type: 'passwordReset'});
    if(!TOKEN) throw new Error('');
    
    next();
}
catch(error){
    return next({
        status: 400,
        title: "Invalid Request",
        message: "We're having trouble verifying your link. Please check the link and try again.",
    });
}
}

export default verifyResetPassword;