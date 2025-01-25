const express = require('express')
const connectDB = require('./config/mongooseConnection')
const path = require('path')
const app = express()
const postRoutes = require('./routes/postRoutes')
const postModel = require('./models/postModel')
const userRoutes = require('./routes/userRoutes')
const cookieParser = require('cookie-parser')
const isLoggedIn = require('./middleware/isLoggedIn')
const expressSession = require('express-session')
const flash = require('connect-flash')
const PORT = process.env.PORT || 3000

//Configure dotenv file
require('dotenv').config()

app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:process.env.SESSION_SECRET
}))
app.use(flash())
app.set('view engine', 'ejs')

// custom middleware
app.use(isLoggedIn)


// mongodb connection
connectDB()


app.get('/', async (req,res)=>{
    let allposts = await postModel.find().sort({createdAt:-1}).populate('user')
    let posts = allposts.slice(0,5)
    let message = req.flash('message')
    res.render('index', {posts, message})
})

//All Routes
app.use('/posts', postRoutes)
app.use('/users', userRoutes)

app.listen(PORT, ()=>{
    console.log("Server Started...")
})