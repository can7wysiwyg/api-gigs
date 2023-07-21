const UserRoute = require("express").Router();
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const verify = require("../middleware/verify");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});



UserRoute.put("/user/update_profile_pic/:id", verify, async (req, res) => {
  const { id } = req.params;

  const owner = await User.findById(id);
  const owned = await User.findById(req.user);

  if (owner._id.toString() !== owned._id.toString()) {
    return res.json({ msg: "Access is denied." });
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ msg: "No files were uploaded." });
  }

  
  const userImage = req.files.userImage;

  try {
    
    const result = await cloudinary.uploader.upload(userImage.tempFilePath);

    
    await User.findByIdAndUpdate(owner._id, { userImageUrl: result.secure_url }, { new: true });

    res.json({ msg: "Profile picture successfully updated." });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ msg: "Failed to update profile picture." });
  }
});




UserRoute.put(
  "/user/update_socials/:id",
  verify,
  asyncHandler(async (req, res) => {

const {id} = req.params

const owner = await User.findById(id);
    const owned = await User.findById(req.user);

    if (owner._id.toString() !== owned._id.toString()) {
      return res.json({ msg: "Access is denied." });
    }


    await User.findByIdAndUpdate(owner, req.body, {new: true})

    res.json({msg: "socials been updated successfully"})





  })
);

module.exports = UserRoute;
