import mongoose from "mongoose";
import { DB_NANE } from "../constant.js";
import dns from "dns";

// Try setting reliable DNS servers on platforms that permit it (safe fallback for Linux/cloud)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (dnsErr) {
  // Ignore error if cloud container restricts changing DNS servers
}

const connectDB = async () => {
  try {
    const rawUrl = process.env.MONGODB_URL || process.env.MONGODB_URI;
    if (!rawUrl) {
      console.error("⚠️ Neither MONGODB_URL nor MONGODB_URI is defined in your environment variables!");
      return null;
    }

    const mongoUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
    const finalUrl = mongoUrl.includes(DB_NANE) ? mongoUrl : `${mongoUrl}/${DB_NANE}`;

    const connectionDB = await mongoose.connect(finalUrl, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });

    console.log(`\n✅ MongoDB connected! DB HOST: ${connectionDB.connection.host}`);
    return connectionDB;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    if (error.message.includes("whitelist") || error.name === "MongooseServerSelectionError") {
      console.error("👉 Make sure your MongoDB Atlas Network Access has IP 0.0.0.0/0 (Allow Access from Anywhere) enabled!");
    }
    // Do not call process.exit(1) on cloud deployment so the web server can still serve health checks
    return null;
  }
};

export default connectDB;