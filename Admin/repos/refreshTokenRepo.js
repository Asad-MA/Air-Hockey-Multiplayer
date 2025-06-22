import RefreshToken from "../models/refreshToken.js";

class RefreshTokenRepository {
    async insertToken(userId , token, ip , userAgent) {
        try{
            await RefreshToken.create({ 
                userId , 
                token , 
                ip , 
                userAgent 
            });
            console.log("Token Added!");
            return true;
        }
        catch(err){
            console.log("Error While adding Refresh token");
            return false;
        }
         
    }

    async findToken(query) {
        return await RefreshToken.findOne(query);
    }

    async findByUserId(userId) {
        return await RefreshToken.findOne(userId);
    }

    async deleteToken(userId){
        await RefreshToken.deleteMany({userId: userId});
    }
}

export default new RefreshTokenRepository();