import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Health check endpoint for cloud platforms (Render, Railway, AWS, etc.)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "COAB Expense Tracker API is live and operational 🚀",
    timestamp: new Date().toISOString()
  });
});

// Configure CORS for both local dev and production cloud deployment
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, server health pings)
      if (!origin) return callback(null, true);

      // In production and dev, allow the request's origin dynamically so credentials are fully supported
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from "./router/user.router.js";

// Routes declaration
app.use("/api/v1/users", userRouter);

// Global Error Handling Middleware - prevents raw 500 HTML crashes
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`[Error] ${req.method} ${req.url}:`, err.message);
  return res.status(statusCode).json({
    statusCode,
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || []
  });
});

export { app };