import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDDINARY_NAME, 
    api_key: process.env.CLOUDDINARY_API_KEY, 
    api_secret: process.env.CLOUDDINARY_API_SECRET
});


const uploadOnCloudinary=async (localFilePath)=>{
    try {
        if(!localFilePath) return null
        //upload the file on cloudinary
        const responce = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has uploaded successfully
        //console.log("file is uploaded on cloudinary",responce,responce.url)
        fs.unlinkSync(localFilePath) 
        return responce

    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the uplaod operation got failed
        return null
    }
}

export {uploadOnCloudinary}