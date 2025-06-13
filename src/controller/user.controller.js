import { AsyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";


const generatingAccessAndRefreshToken = async (user_id) => {

    const user = await User.findById(user_id);

    const accessToken = await user.generatingAccessToken();
    const refreshToken = await user.generatingRefreshToken();

    
    if (!accessToken || !refreshToken) throw new ApiError(506, "Something went Wrong while generating tokens");

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken };




}



const registerUser = AsyncHandler(async (req, res) => {

    const { fullName, userName, email, password } = req.body;


    if ([fullName, userName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All field are required");
    }

    const existedUser = await User.findOne(
        {
            $or: [{ userName }, { email }],
        }
    );


    if (existedUser) throw new ApiError(409, "userName or email is already taken");

    // console.log("FILES RECEIVED:", JSON.stringify(req.files, null, 2));

    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath = null;

    if (Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) coverImageLocalPath = req.files.coverImage[0].path;


    if (!avatarLocalPath) throw new ApiError(400, "avatar file is required");

    const coverImageUrl = await uploadOnCloudinary(coverImageLocalPath);
    const avatarUrl = await uploadOnCloudinary(avatarLocalPath);

    console.log(avatarUrl)


    if (!avatarUrl) throw new ApiError(503, "something went wrong while uploading file");
    console.log('after uploading file')

    const userObject = {
        fullName,
        userName,
        password,
        email,
        avatar: avatarUrl,
        coverImage: coverImageUrl || ""


    }

    const user = await User.create(userObject);

    const responseData = await User.findById(user._id).select(" -password -refreshToken");



    if (!responseData) throw new ApiError(505, "Something went wrong while registering the user ");




    res.status(200).json(new ApiResponse(responseData, 201));
})


const loginUser = AsyncHandler(async (req, res) => {

    /*  
     take userdata from frontend username - password 
     validate  if they are empty or not if empty throw error
     find the user by username or email 
    
     check if the password is correct 
    
     if password is correct then send the response
    
     
    
    
    
    
    
    
    */

    const { userName = "", email = "", password = "" } = req.body;





    if (userName === "" && email === "") {
        throw new ApiError(400, "userName or enail are required");
    }

    if (password === "") throw new ApiError(400, "Password is required");







    const userWeGotFromCredential = await User.findOne({
        $or: [{ userName }, { email }],
    });





    if (!userWeGotFromCredential) throw new ApiError(401, "user does not exist");


    const passwordValidation = await userWeGotFromCredential.isPasswordCorrect(password);
    if (!passwordValidation) throw new ApiError(409, "password is incorrect");


    const { accessToken, refreshToken } = await generatingAccessAndRefreshToken(userWeGotFromCredential._id);


    const loggedInUser = await User.findById(userWeGotFromCredential._id).select(" -password -refreshToken ");


    const options = {
        httpOnly: true,
        secure: true,
    }


    res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse("User Logged In successfully", { user: loggedInUser, refreshToken, accessToken }, 201));







})




const logoutUser = AsyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        }
    )


    const options = {
        httpOnly: true,
        secure: true,
    }


    res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse("User logged out Successfully ", {}, 201));



})




const refreshAccessToken = AsyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) throw new ApiError(409, "Unauthorized access");

    try {
        const decodedRefreshToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedRefreshToken?._id)
        if (!user) throw new ApiError(409, "invalid refresh token");

        if (incomingRefreshToken !== user.refreshToken) throw new ApiError(402, "Refresh token is expired or used ");


        const { accessToken, newRefreshToken } = await generatingAccessAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true,
        }


        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse("Access Token Refreshed", { accessToken, refreshToken: newRefreshToken, }, 201))




    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }


})








export { registerUser, loginUser, logoutUser, refreshAccessToken }