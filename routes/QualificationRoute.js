const QualiRoute = require("express").Router();
const TQualification = require("../models/TutorQualificationModel");
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

QualiRoute.post("/qualification/create_qualification", verify, async (req, res) => {
  const { qualification, tutorSpecialty1, tutorSpecialty2, tutorSpecialty3 } = req.body;

  if (!tutorSpecialty1 || !qualification) {
    return res.json({ msg: "Fields cannot be blank!" });
  }

  if (!req.files || !req.files.qualificationImage) {
    return res.status(400).json({ msg: "Qualification image is required." });
  }

  const qualify = new TQualification({
    qualification,
    tutorSpecialty1,
    tutorSpecialty2,
    tutorSpecialty3,
    owner: req.user.id,
  });

  try {
    
    const qualificationImage = req.files.qualificationImage;
    const result = await cloudinary.uploader.upload(qualificationImage.tempFilePath);

    
    qualify.qualificationImage = result.secure_url;

    await qualify.save();

    res.json({ msg: "You have successfully created your qualification!" });
  } catch (error) {
    console.error("Error creating qualification:", error);
    res.status(500).json({ msg: "Failed to create qualification." });
  }
});





QualiRoute.get(
  "/qualification/show_all/:id",
  asyncHandler(async (req, res) => {
    const{id} = req.params
    await TQualification.find({ owner: id }).then((owner) => {
      res.json({ owner });
    });
  })
);


QualiRoute.get(
  "/qualification/owner_view",
  verify,
  asyncHandler(async (req, res) => {
    await TQualification.find({ owner: req.user.id }).then((owned) => {
      res.json({ owned });
    });
  })
);

QualiRoute.delete(
  "/qualification/owner_delete/:id",
  verify,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const qualfication = await TQualification.findById(id);
    const owned = await User.findById(req.user);

    if (qualfication.owner.toString() !== owned._id.toString()) {
      return res.json({ msg: "Access is denied." });
    }

    await TQualification.findByIdAndDelete(qualfication);

    res.json({ msg: "deleted" });
  })
);

QualiRoute.put(
  "/qualification/owner_update/:id",
  verify,
  asyncHandler(async (req, res) => {
   
    const { id } = req.params;

    const qualfication = await TQualification.findById(id);
    const owned = await User.findById(req.user);

    if (qualfication.owner.toString() !== owned._id.toString()) {
      return res.json({ msg: "Access is denied." });
    }

    await TQualification.findByIdAndUpdate(
        qualfication,
        req.body,
      {new: true}
      )
    
      res.json({msg: "your qualification  has been successfully updated"})

  })
);


QualiRoute.get("/qualification/show_all", asyncHandler(async(req, res) => {
    const qualfications = await TQualification.find()

    res.json({qualfications})
}))

module.exports = QualiRoute;
