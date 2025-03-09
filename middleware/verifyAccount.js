const verifyAccount = (req, res, next) => {
    const userID = req.params.userId; 
    const token = req.query.token;    


    if (!userID || !token) {
        return next({
            status: 400,
            title: "Invalid Request",
            message: "We're having trouble verifying your email. Please check the link and try again.",
            suggestion: "Try requesting a new verification email."
        });
    }

    console.log("User ID:", userID);
    console.log("Token:", token);

    req.verifiedData = { userID, token }; 
    next();
};


export default verifyAccount;