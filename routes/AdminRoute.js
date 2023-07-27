const AdminRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const authAdmin = require('../middleware/authAdmin')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyAdmin = require("../middleware/verifyAdmin");
const User = require('../models/UserModel')
const Admin = require('../models/AdminModel')
const Category = require('../models/CategoryModel')
const Subject = require("../models/SubjectModel")
const TQualification = require("../models/TutorQualificationModel")


AdminRoute.post('/admin/register',   asyncHandler(async(req, res) => {
    const{name, email, password} = req.body

    if(!name || !email || !password) res.json({msg: "fields cannot be blank"})




    const emailExists = await  Admin.findOne({ email });

    if (emailExists) {
      res.json({ msg: "The email exists, please user another one or login" });
    }

    
  
  const salt =  await bcrypt.genSalt(10);
  const hashedPassword = await  bcrypt.hash(password, salt);

   await Admin.create({
    name,
    email,
    password: hashedPassword
  })

  res.json({msg: "your account has been successfully created!"})



}))


AdminRoute.post("/admin/login", asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const userExists = await Admin.findOne({ email }).select("+password");
    

    if (!userExists) {
      res.json({
        msg: "No user associated with this username exists in our system. Please register.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, userExists.password);

    if (passwordMatch) {
      
      let refreshtoken = createRefreshToken({id: userExists._id})

      res.cookie('refreshtoken', refreshtoken, { expire: new Date() + 9999 });

      jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_ADMIN, (err, admin) =>{
        if(err) return res.status(400).json({msg: "Please Login or Register"})
    
        const accesstoken = createAccessToken({id: admin.id})
        
    
        res.json({accesstoken}) })


      
    } else {
      res.json({ msg: "check your password again" });
    } 


    
}))


AdminRoute.get('/admin/user',verifyAdmin, asyncHandler(async(req, res) => {
  try{
    const admin = await Admin.findById(req.admin).select('-password')
    if(!admin) return res.status(400).json({msg: "this admin does not exist d does not exist."})
  
    res.json(admin)
  
  
  
  
  }
    catch(err) {
      return res.status(500).json({msg: err.message})
  
  
    }
  
  
  }))


AdminRoute.put('/admin/update_user/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res) => {

const {id} = req.params

await User.findByIdAndUpdate(id, req.body, {new: true})

res.json({msg: "user has been succesfully updated"})


}))


AdminRoute.get('/admin/single_user/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res) => {

const {id} = req.params

const user = await User.findById({_id: id})

res.json({user})

}))



AdminRoute.delete('/admin/delete_user/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res) => {

    const{id} = req.params

    await User.findByIdAndDelete(id)

    res.json({msg: "user has been successfully deleted"})

}))


AdminRoute.delete('/admin/delete_subject/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res) => {
const{id} = req.params

await Subject.findByIdAndDelete(id)

res.json({msg: "subject deleted successfully!!"})

}))


AdminRoute.delete("/admin/delete_qualification/:id", verifyAdmin, authAdmin, asyncHandler(async(req, res) => {

const {id} = req.params

await TQualification.findByIdAndDelete(id)

res.json({msg: "qualification has successfully been deleted..."})


}))


AdminRoute.put('/admin/suspend_account/:id',  verifyAdmin, authAdmin, asyncHandler(async(req, res) => {



await User.findByIdAndUpdate(req.params.id, req.body)

res.json({msg: "account has been succesfully updated"})




}))


AdminRoute.post('/admin/create_category', verifyAdmin, authAdmin, asyncHandler(async(req, res) => {

    const{catName} = req.body

    if(!catName) res.json({msg: "field cannot be empty."})

    await Category.create({
        catName
    })

    res.json({msg: "category has been created..."})

    

}))

AdminRoute.get('/admin/show_categories', asyncHandler(async(req, res) => {
    const results = await Category.find()

    res.json({results})
}))


AdminRoute.delete('/admin/delete_category/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res) => {

const{id} = req.params

await Category.findByIdAndDelete(id)


}))





const createAccessToken = (admin) =>{
    return jwt.sign(admin, process.env.ACCESS_TOKEN_ADMIN, {expiresIn: '7d'})
  }
  const createRefreshToken = (admin) =>{
    return jwt.sign(admin, process.env.REFRESH_TOKEN_ADMIN, {expiresIn: '7d'})
  }
  





module.exports = AdminRoute
