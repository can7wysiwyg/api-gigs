const UserRoute = require("express").Router();
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const verify = require("../middleware/verify");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "..", "public"));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({ storage });

UserRoute.put(
  "/user/update_profile_pic/:id",
  upload.single("userImage"),
  verify,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const owner = await User.findById(id);
    const owned = await User.findById(req.user);

    if (owner._id.toString() !== owned._id.toString()) {
      return res.json({ msg: "Access is denied." });
    }

    await User.findByIdAndUpdate(
      owner,
      {
        userImage: {
          data: fs.readFileSync("./public/" + req.file.filename),
          contentType: "image/jpg",
        },
      },
      { new: true }
    );

    res.json({ msg: "successfully updated" });
  })
);

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

    res.json({msg: "social media account(s) updated successfully"})





  })
);

module.exports = UserRoute;
