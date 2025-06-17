import mongoose, { isValidObjectId } from "mongoose";
import { AsyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";



const createTweet = asyncHandler(async (req, res) => {

    const { content } = req.body;

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");

    }

    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "user is not authenticated ");
    }

    const tweetToBeAdded = {
        content,
        owner: userId,
    }

    const tweet = await Tweet.create(tweetToBeAdded);

    return res
        .status(200)
        .json(new ApiResponse("tweet Created successfully", tweet, 200))

})





const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId || !(isValidObjectId(userId))) {
        throw new ApiError(400, "user id not found");
    }

    const userTweets = await Tweet.aggregate([{
        $match: {
            owner: mongoose.Types.ObjectId(userId),
        }
    },


    ]);

    if (!userTweets.length) {
        throw new ApiError(400, "User tweets not found");
    }

    return res.status(200)
        .json(new ApiResponse("User tweets fetched successfully ", userTweets, 200))


});





const updateTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params;
    const { newContent } = req.body;

    if (!newContent || newContent.trim() === "") {
        throw new ApiError(400, "Content is required");

    }
    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, "tweet id is required");
    }


    const tweet = await Tweet.findById(tweetId);

   

    if (tweet.owner.toString() !== req.user._id.toString())
    {
       throw new ApiError(400, "only author can update tweets")

    }

       tweet.content = newContent;
       const tweetAfterUpdation =   await tweet.save({validateBeforeSave : false});


    if (!tweetAfterUpdation) {
        throw new ApiError (500,"something went wrong while updating the tweet");
    }


    return res.status(200)
        .json(new ApiResponse("tweet updated succesfully", tweetAfterUpdation, 200))

})





const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;
    const userId = req.user._id;

    if(!tweetId || !isValidObjectId(tweetId))
    {
        throw new ApiError(400,"tweet id not found")
    }
    
    if(!userId) {
       throw new ApiError(400,"not authorized") 
    }

    const tweet =  await Tweet.findById(tweetId);

    if(!tweet) {
         throw new ApiError(400, "tweet not found")
    }

    if(tweet.owner.toString() !== userId.toString())
    {
        throw new ApiError(400, "only author can delete tweets")
    }

    await tweet.deleteOne();


    return res.status(200)
    .json(new ApiResponse("tweet deleted succesfully", {}, 200))




})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}