import { app } from "./src/app.js";
import "dotenv/config";
import connectDB from "./src/db/config.js";

const PORT = process.env.PORT || 8000;

// Start HTTP server immediately on 0.0.0.0 so cloud providers (Render, Railway, Heroku) pass health checks
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`⚙️ Server is running and listening on port: ${PORT}`);
});

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("🚀 Application is fully operational.");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

export { server };
