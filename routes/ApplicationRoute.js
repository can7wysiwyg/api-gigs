const AppRoute = require('express').Router()
const verify = require('../middleware/verify')
const asyncHandler = require('express-async-handler')
const Apply = require('../models/ApplicationModel')



AppRoute.post('/user/application_form', verify, asyncHandler(async(req, res) => {

    const {description} = req.body
    
    if(!description) res.json({msg: "this field cannot be empty.."})

    const testimonial = new Apply({
        description,
        owner: req.user.id
    })

    await testimonial.save().then((error) => {
        if (!error) {
          Apply.find({}).populate("owner").exec();
        }
      });

     

      res.json({msg: "Congratulations..."})
  



}))


AppRoute.get("/user/show_review/:id", verify,  asyncHandler(async(req, res) => {
  const {id} = req.params

const result = await Apply.findOne({owner: id})

res.json({result})

}))

module.exports = AppRoute

