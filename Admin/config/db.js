import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";


dotenv.config({ path: path.join("./config/", ".env") });

class Database {
    constructor() {
        this.connect();
    }

    async connect() {
        try {
            await mongoose.connect(process.env.MONGO_URI, {});
            console.log("✅ Database Connected");
        } catch (error) {
            console.error("❌ Database Connection Failed:", error);
            process.exit(1);
        }
    }

    
}

export default new Database();
