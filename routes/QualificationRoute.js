const QualiRoute = require("express").Router();
const TQualification = require("../models/TutorQualificationModel");
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

QualiRoute.post(
  "/qualification/create_qualification",
  verify,
  upload.single("qualificationImage"),
  asyncHandler(async (req, res) => {
    const { qualification, tutorSpecialty1, tutorSpecialty2, tutorSpecialty3 } =
      req.body;

    if (!tutorSpecialty1 || !qualification)
      res.json({ msg: "fields cannot be blank!" });

    const qualify = await TQualification({
      qualification,
      tutorSpecialty1,
      tutorSpecialty2,
      tutorSpecialty3,
      owner: req.user.id,
      qualificationImage: {
        data: fs.readFileSync("./public/" + req.file.filename),
        contentType: "image/jpg",
      },
    });

    await qualify.save().then((error) => {
      if (!error) {
        TQualification.find({}).populate("owner").exec();
      }
    });

    res.json({ msg: "you have successfully created your qualification!" });
  })
);

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
