const AdminRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const verify = require('../middleware/verify')
const authAdmin = require('../middleware/authAdmin')
const User = require('../models/UserModel')
const Category = require('../models/CategoryModel')


AdminRoute.delete('/admin/delete_user/:id', verify, authAdmin, asyncHandler(async(req, res) => {

    const{id} = req.params

    await User.findByIdAndDelete(id)

    res.json({msg: "user has been successfully deleted"})

}))


AdminRoute.put('/admin/suspend_account/:id',  verify, authAdmin, asyncHandler(async(req, res) => {



await User.findByIdAndUpdate(req.params.id, req.body)

res.json({msg: "account has been succesfully updated"})




}))


AdminRoute.post('/admin/create_category', verify, authAdmin, asyncHandler(async(req, res) => {

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

AdminRoute.get('/admin/playing/p', asyncHandler(async(req, res) => {
      
        

    const zoto = await Category.find({catName: req.query.name })

    res.json({zoto})
}))

module.exports = AdminRoute
