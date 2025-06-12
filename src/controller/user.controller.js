import { AsyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  {uploadOnCloudinary} from "../utils/Cloudinary.js";
import { User } from "../models/user.model.js";






const registerUser = AsyncHandler(async (req, res) => {

    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    console.log(req.body);
    const { fullName, userName, email, password } = req.body;


    if ([fullName, userName, email, password].some((field) => field?.trim() === ""))
    {
        throw new ApiError({Message : "All field are required", statuscode : 400});
    }

    const existedUser = User.findOne(
        {
            $or : [{userName}, {email}],
        }
    );


    if (existedUser) throw new ApiError ({Message : "userName or email is already taken", statuscode : 409});


    const avatarLocalPath = req.files.avatar[0].path;
    const coverImageLocalPath = req.files.coverImage[0].path;


    if (!avatarLocalPath) throw new ApiError(400,"avatar file is required");
     
    const coverImageUrl =  await uploadOnCloudinary(coverImageLocalPath);
    const avatarUrl =  await uploadOnCloudinary(avatarLocalPath);

    console.log(avatarUrl)


    if(!avatarUrl) throw new ApiError(503, "something went wrong while uploading file");

    const userObject = {
        fullName,
        userName,
        password,
        email,
        avatar : avatarUrl.url,
        coverImage : coverImageUrl?.url || ""


    }

    const user = await User.create(userObject);

    const responseData = User.findById(user._id).select(" -password -refreshToken");



   if (!responseData) throw new ApiError(505,"Something went wrong while registering the user ");




        res.status(200).json(new ApiResponse(responseData, 201));
})

export { registerUser }