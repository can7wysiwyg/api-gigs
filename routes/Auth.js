const Auth = require('express').Router()
const User = require("../models/UserModel")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verify = require("../middleware/verify");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

Auth.post('/auth/register', async (req, res) => {
  const { fullname, username, email, password, phoneNumber, securityAnswer } = req.body;

  if (!fullname || !username || !email || !password || !phoneNumber || !securityAnswer) {
    return res.json({ msg: "Fields cannot be blank" });
  }

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return res.json({ msg: "The username you chose exists, please use another" });
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.json({ msg: "The email exists, please use another" });
  }

  if (!req.files || !req.files.userImage) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const file = req.files.userImage;

  cloudinary.uploader.upload(file.tempFilePath, {
    folder: 'testImage',
    width: 150,
    height: 150,
    crop: "fill"
  }, async (err, result) => {
    if (err) {
      console.error("Error uploading user image:", err);
      return res.status(500).json({ msg: "Failed to upload user image" });
    }

    removeTmp(file.tempFilePath);

    await User.create({
      fullname,
      username,
      email,
      phoneNumber,
      securityAnswer,
      userImage: result.secure_url,
      password: hashedPassword
    });

    res.json({ msg: "Your account has been successfully created!" });
  });
});







Auth.post("/auth/login", asyncHandler(async(req, res) => {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username }).select("+password");
    

    if (!userExists) {
      res.json({
        msg: "No user associated with this username exists in our system. Please register.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, userExists.password);

    if (passwordMatch) {
      let accesstoken = createAccessToken({id: userExists._id })
      let refreshtoken = createRefreshToken({id: userExists._id})

      res.cookie('refreshtoken', refreshtoken, { expire: new Date() + 9999 });

      jwt.verify(refreshtoken, process.env.REFRESH_TOKEN, (err, user) =>{
        if(err) return res.status(400).json({msg: "Please Login or Register"})
    
        const accesstoken = createAccessToken({id: user.id})
        
    
        res.json({accesstoken}) })


      
    } else {
      res.json({ msg: "check your password again" });
    } 


    
}))


Auth.post(
  "/auth/forgot_password",
  asyncHandler(async (req, res) => {
    const { securityAnswer, email } = req.body;

    if (!securityAnswer || !email) {
      res.json({ msg: "fields cannot be empty." });
    }

    const emailFound = await User.findOne({ email });
    const answerFound = await User.findOne({ securityAnswer });

  


    if (emailFound && answerFound) {
      const accessToken =  createAccessToken( { id: emailFound._id })
      
      res.json({ accessToken });
    } else {
      res.json({ msg: "please contact the admin to help you in password reset." });
    }
  })
);

Auth.put(
  "/auth/reset_password",
  verify,
  asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) {
      res.json({ msg: "field cannot be empty." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        password: passwordHash,
      }
    );

    res.json({ msg: "succesfully updated" });
  })
);

Auth.get('/auth/user',verify, asyncHandler(async(req, res) => {
  try{
    const user = await User.findById(req.user).select('-password')
    if(!user) return res.status(400).json({msg: "User does not exist."})
  
    res.json(user)
  // console.log(user);
  
  // res.json(req.user)
  
  }
    catch(err) {
      return res.status(500).json({msg: err.message})
  
  
    }
  
  
  }))


  Auth.get('/auth/users', asyncHandler(async(req, res) => {

    const results = await User.find()
    res.json(results)

  }))
  



const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '7d'})
  }
  const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN, {expiresIn: '7d'})
  }
  



module.exports = Auth


function removeTmp(filePath) {
  fs.unlink(filePath, err => {
    if (err) throw err;
  });
}