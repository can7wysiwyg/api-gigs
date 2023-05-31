const AdminRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const verify = require('../middleware/verify')
const authAdmin = require('../middleware/authAdmin')
const User = require('../models/UserModel')


AdminRoute.delete('/admin/delete_user/:id', asyncHandler(async(req, res) => {

    const{id} = req.params

    await User.findByIdAndDelete(id)

    res.json({msg: "user has been successfully deleted"})

}))


module.exports = AdminRoute
