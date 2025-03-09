import user from "../models/user.js";

class UserRepository {
    async createUser(name, email, password) {
        return await user.create({ name, email, password });
    }

    async findUserByEmail(email) {
        return await user.findOne({ email });
    }

    async findUserById(userId) {
        return await user.findById(userId);
    }
}

export default new UserRepository();