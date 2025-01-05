import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
//console.log("process.env.CORS_ORIGIN:",process.env.CORS_ORIGIN)
app.use(cors({
    //origin: "http://localhost:5173",
    origin: process.env.CORS_ORIGIN,
    credentials: true  // Allow credentials (cookies)
}))

app.use(express.json())
//app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from "./router/user.router.js"


//routes declaration
app.use("/api/v1/users",userRouter)

// here route url like ----> http://localhost:800/api/v1/users/register
export {app}