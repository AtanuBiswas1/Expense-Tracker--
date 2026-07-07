import mongoose from "mongoose";
import { DB_NANE } from "../constant.js";
import dns from "dns";

// Set reliable DNS servers for Node.js DNS resolution to fix SRV lookup issues on Windows
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL.endsWith('/') ? process.env.MONGODB_URL.slice(0, -1) : process.env.MONGODB_URL;
    const connectionDB = await mongoose.connect(`${mongoUrl}/${DB_NANE}`);
    console.log(`\n Mongodb connected !! DB HOST : ${connectionDB.connection.host}`);
    console.log("Connected");
  } catch (error) {
    console.log("Mongodb connection error in /db/config.js", error)
    process.exit(1)
  }
}

export default connectDB