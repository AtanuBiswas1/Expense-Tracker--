import {app} from './app.js'
import 'dotenv/config';
import dotenv from "dotenv";
import connectDB from "./db/config.js"

dotenv.config({
    path: "./env",
  });

  connectDB()
  .then(() => {
      app.listen(process.env.PORT || 6000, () => {
          console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
      })
  })
  .catch((err) => {
      console.log("MONGO db connection failed !!! ", err);
  })

