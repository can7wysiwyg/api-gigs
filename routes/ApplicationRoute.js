const AppRoute = require('express').Router()
const verify = require('../middleware/verify')
const asyncHandler = require('express-async-handler')
const Apply = require('../models/ApplicationModel')
const User = require('../models/UserModel')



AppRoute.post('/user/application_form/:id', verify, asyncHandler(async(req, res) => {

    const {description} = req.body
    const {id} = req.params

    if(!description) res.json({msg: "this field cannot be empty.."})

    const testimonial = new Testimonial({
        description,
        owner: req.user.id
    })

    await testimonial.save().then((error) => {
        if (!error) {
          Apply.find({}).populate("owner").exec();
        }
      });

      await User.findByIdAndUpdate(id, {role: 1}, {new: true})


      res.json({msg: "Congratulations..."})
  



}))

module.exports = AppRoute

