import { registerUser, loginUser,logoutUser, refreshAccessToken,changeCurrentPassword , updateAccountDetail, updateCoverImage, updateAvatar, getCurrentUser, getUserChannelProfile, getWatchHistory } from "../controller/user.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();



router.route('/register').post(upload.fields([{
    name: "avatar",
    maxCount: 1,
}, {
    name: "coverImage",
    maxCount: 1,
}]), registerUser);


router.route('/login').post(loginUser);

router.route('/logout').post(verifyJWT, logoutUser);

router.route('/refresh-token').post(refreshAccessToken);

router.route('/change-password').post(verifyJWT,changeCurrentPassword);

router.route('/upate-account').patch(verifyJWT,updateAccountDetail);

router.route('/update-avatar').patch(verifyJWT,upload.single("avatar"),updateAvatar);

router.route('/update-cover-image').patch(verifyJWT,upload.single("coverImage"),updateCoverImage);

router.route("/current-user").get(verifyJWT, getCurrentUser)



router.route('/channel/:userName').get(verifyJWT,getUserChannelProfile);


router.route('/history').get(verifyJWT,getWatchHistory);






export default router;