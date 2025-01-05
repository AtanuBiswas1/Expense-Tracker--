import mongoose from "mongoose";
import { DB_NANE } from "../constant.js";



const connectDB= async ()=>{
    try {
       const connectionDB= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NANE}`)
       console.log(`\n Mongodb connected !! DB HOST : ${connectionDB.connection.host}`);
       console.log("Connected");
       
    
    } catch (error) {
        console.log("Mongodb connection error in /db/config.js",error)
        process.exit(1)
    }
}

export default connectDB