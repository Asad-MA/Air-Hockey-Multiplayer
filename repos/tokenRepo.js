import VerificationToken from "../models/verficationToken.js";

class TokenRepository {
    async insertToken(userId , token, type) {
        try{
            await VerificationToken.create({ userId , token , type });
            console.log("Token Added!");
            return true;
        }
        catch(err){
            console.log("Error While adding verification token");
            return false;
        }
         
    }

    async findToken(email) {
        return await VerificationToken.findOne({ email });
    }

    async findByUserId(userId) {
        return await VerificationToken.findOne(userId);
    }
}

export default new TokenRepository();