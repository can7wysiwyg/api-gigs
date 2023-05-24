const SubjectRouter = require("express").Router();
const asyncHandler = require("express-async-handler");
const verify = require("../middleware/verify");
const Subject = require("../models/SubjectModel");
const User = require("../models/UserModel");


SubjectRouter.get("/subject/show_all", asyncHandler(async(req, res) => {

    const subject = await Subject.find()

    res.json({subject})
}))

SubjectRouter.get("/subject/show_users/:id", asyncHandler(async(req, res) => {
  const{id} = req.params
  
  await Subject.find({ subjectOwner: id }).then((subjects) =>
      res.json({ subjects })
    );
}))


SubjectRouter.post(
  "/subject/create_subject",
  verify,
  asyncHandler(async (req, res) => {
    const { subjectName, subjectPrice, subjectCommentary } = req.body;

    if (!subjectName || !subjectPrice || !subjectCommentary)
      res.json({ msg: "fields cannot be blank!" });

    const subject = await Subject({
      subjectName,
      subjectPrice,
      subjectCommentary,
      subjectOwner: req.user.id,
    })
      
    
    await subject.save().then((error) => {
      if (!error) {
        Subject.find({}).populate("subjectOwner").exec();
      }
    });

    
    res.json({
      msg: "the subject you would like to offer tutoring services in has been posted! it's our hope that you find a student ",
    });
  })
);

SubjectRouter.get(
  "/subject/owner_view",
  verify,
  asyncHandler(async (req, res) => {
    await Subject.find({ subjectOwner: req.user.id }).then((subjects) =>
      res.json({ subjects })
    );
  })
);

SubjectRouter.put("/subject/edit_subject/:id", verify, asyncHandler(async(req, res) => {
    const {id} = req.params

  const subject = await Subject.findById(id)
  const owner = await User.findById(req.user)


  if ( subject.subjectOwner.toString() !== owner._id.toString()) {
    return res.json({ msg: 'Access is denied.' });
  }

  await Subject.findByIdAndUpdate(
    subject,
    req.body
  )

  res.json({msg: "the subject has been successfully updated"})


}))


SubjectRouter.delete("/subject/delete_subject/:id", verify, asyncHandler(async(req, res) => {

  const{id} = req.params

  const subject = await Subject.findById(id)
  const owner = await User.findById(req.user)


  if (subject.subjectOwner.toString() !== owner._id.toString()) {
    return res.json({ msg: 'Access is denied.' });
  }

  
  await Subject.findByIdAndDelete(subject)

  res.json({msg: 'deleted'})



}))



module.exports = SubjectRouter;
