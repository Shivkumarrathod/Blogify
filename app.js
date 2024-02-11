require('dotenv').config()
const express  = require('express');
const path = require('path');
const mongoose  = require('mongoose')
const cookieParser = require('cookie-parser')

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const { handleCheckUserToken } = require('./middleware/authentication');

const Blog = require('./models/blog')

const app = express()
const PORT = process.env.PORT || 8000;
//mongodb
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("mongoDb is connected!"))

//ejs
app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

//middleware
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(handleCheckUserToken(("token")))
app.use(express.static(path.resolve('./public')))

app.get('/',async(req,res)=>{
    const allBlogs = await Blog.find({})
    res.render('home',{
        user:req.user,
        blogs:allBlogs
    })
})
app.use('/user',userRoute)
app.use('/blog',blogRoute)

app.listen(PORT,()=>{
    console.log(`server is connected at PORT:${PORT}`);
})