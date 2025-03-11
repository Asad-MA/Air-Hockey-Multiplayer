import AuthService from "../services/authService.js";

const authenticate = (req , res , next) => {
    const token = req.cookies.token;

    // console.log("Token: " , token);

    if (!token) return res.status(401).redirect("/login");
       AuthService.verifyToken(token)
       .then(user => {
        // console.log('Authenticate:-)'  , user);
        req.user = {name: user.name , email: user.email}
        next();
       })
       .catch(err => {
        console.log("Unauthorized")
        return res.status(401).json({ message: "Invalid Token!" });
       })
}


export default authenticate;