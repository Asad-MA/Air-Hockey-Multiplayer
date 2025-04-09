import user from "../models/user.js";

const API = {};

API.getUsers = async (req, res) => { 
    const allUsers = await user.find();
    res.status(200).json(allUsers);
}

API.getUser = (req, res) => {
    res.send('Hello User');
}

export default API;