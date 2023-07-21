const UserRoute = require("express").Router();
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const verify = require("../middleware/verify");
const fs = require("fs");


UserRoute.put(
  "/user/update_profile_pic/:id",

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

    res.json({msg: "socials been updated successfully"})





  })
);

module.exports = UserRoute;
