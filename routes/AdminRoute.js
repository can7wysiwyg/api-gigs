const AdminRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const verify = require('../middleware/verify')
const authAdmin = require('../middleware/authAdmin')
const User = require('../models/UserModel')


AdminRoute.delete('/admin/delete_user/:id', verify, authAdmin, asyncHandler(async(req, res) => {

    const{id} = req.params

    await User.findByIdAndDelete(id)

    res.json({msg: "user has been successfully deleted"})

}))


AdminRoute.put('/admin/suspend_account/:id',  verify, authAdmin, asyncHandler(async(req, res) => {



await User.findByIdAndUpdate(req.params.id, req.body)

res.json({msg: "account has been succesfully updated"})




}))


module.exports = AdminRoute
