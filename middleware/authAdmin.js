const Admin = require('../models/AdminModel')
const asyncHandler = require('express-async-handler')

const authAdmin = asyncHandler(async(req, res, next) => {

    const admin = await Admin.findOne({
        _id: req.admin.id
    })


    

    if(admin.admin === 0 ) return res.json({msg: "you are not an admin"})

    next()


})

module.exports = authAdmin