import AuthService from "../../services/authService.js";

const defaultAuth = async (req, res, next) => {
    console.log(req.headers);
    
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = await AuthService.verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

export default defaultAuth;