import 'dotenv/config'
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.get("/", (req, res) => {
  res.send("Hello, World!");

});
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps or curl)
      if (!origin) return callback(null, true);
      if (
        process.env.CORS_ORIGIN === "*" ||
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

app.use(express.json())
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from "./router/user.router.js"


//routes declaration
app.use("/api/v1/users", userRouter)

// here route url like ----> http://localhost:800/api/v1/users/register
export { app }