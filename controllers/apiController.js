import user from "../models/user.js";

const API = {};


API.getUsers = async (req, res) => { 
    const allUsers = await user.find();
    res.status(200).json(allUsers);
}

API.getUser = (req, res) => {
    res.send('Hello User');
}

API.search = async (req , res) => {
    try {
        const { q } = req.query;
        const query = {};
    
        if (q) {
          query.$or = [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } },
          ];
        }
    
        const users = await user.find(query);
    
        res.json(users);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

export default API;