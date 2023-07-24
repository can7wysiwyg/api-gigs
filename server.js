require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port  = process.env.PORT || 5500
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const Auth = require('./routes/Auth')
const SubjectRouter = require("./routes/SubjectRoute")
const QualiRoute = require("./routes/QualificationRoute")
const UserRoute = require("./routes/UserRoute")
const AdminRoute = require("./routes/AdminRoute")
const AppRoute = require("./routes/ApplicationRoute")




mongoose.connect(process.env.MONGOURL)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function(){
    console.log("connected to database");
  });


  app.use(cors())
  app.use(express.json({limit: '50mb'}))
  app.use(express.urlencoded({extended: true, limit: '50mb'}))
  app.use(cookieParser())
  app.use(fileUpload({
    useTempFiles: true
}))
  


  app.use(Auth)
  app.use(SubjectRouter)
  app.use(QualiRoute)
  app.use(UserRoute)
  app.use(AdminRoute)
  app.use(AppRoute)



app.listen(port, () => {
    console.log(`Your server is now running on port ${port}`);
})
