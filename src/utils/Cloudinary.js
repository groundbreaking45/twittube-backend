import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import { ApiError } from "./ApiError.js";


cloudinary.config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY  ,
  api_secret: process.env.CLOUDINARY_API_SECRET  ,
});


const uploadOnCloudinary = async (localFilePath) => {

    try {
        if(!localFilePath) return null;
    
      const response =  await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto",
        })
       
        if(!response) return null;
    
        console.log(`file uploaded on cloudinary ${response.url}`);
        fs.unlinkSync(localFilePath)
        return response.url;

    } catch (error) {
        console.log( `File could not be uploaded on clodinary ` )
        fs.unlinkSync(localFilePath);
        
    }
    


}


const publicIdGenerator = (url) => {
      const parts = url.split('/');
      console.log(typeof parts)
      const publicIdwithExt = parts.slice(7).join('/');
      const publicId = publicIdwithExt.split('.').slice(0,-1).join('.');
      return publicId;
}



const deleteCloudinaryFile  = async (cloudinaryURL) => {

    const public_ID = publicIdGenerator(cloudinaryURL);

    try {
        await cloudinary.uploader.destroy(public_ID);
    } catch (error) {
        throw new ApiError(569, "something went wrong while deleting old file")
    }

}


export {uploadOnCloudinary, deleteCloudinaryFile};