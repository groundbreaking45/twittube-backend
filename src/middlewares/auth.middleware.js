import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";


export const verifyJWT = AsyncHandler(async (req,_,next) => {

    const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ","");

   if (!token) throw new ApiError(409, "Unauthorized access");
   console.log(token);

   const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

   const user = await User.findById(decodedToken?._id).select(" -password -refreshToken ");

   if(!user) throw new ApiError(405,"Invalid Access token ");

   req.user = user;

   next();

})