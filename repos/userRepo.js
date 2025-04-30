import user from "../models/user.js";

class UserRepository {
    async createUser(name, email, password) {
        return await user.create({ name, displayName: name , email, password });
    }

    async findUserByEmail(email) {
        return await user.findOne({ email });

        
    }

    async findUserById(userId) {
        return await user.findById(userId);
    }

    async updateUser(userId, updateData) {
        return await user.findByIdAndUpdate(userId, updateData, { new: true });
    }
}

export default new UserRepository();