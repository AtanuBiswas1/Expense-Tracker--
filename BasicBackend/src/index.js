import  express  from "express";
import 'dotenv/config';
import dotenv from "dotenv";
const app = express()
dotenv.config({
    path: "./env",
  });


app.get("/", (req, res) => {
    res.send("Hello, World!");
  });


app.listen(process.env.PORT || 6000, () => {
    console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
})