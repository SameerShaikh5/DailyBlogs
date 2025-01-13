const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')

// For likes and comments
async function isAuthenticated(req,res,next){
    let token = req.cookies.token
    if(token){
        let data = jwt.verify(token, process.env.JWT_SECRET_TOKEN)
        let user = await userModel.findOne({email:data.email}).select('-password')
        req.user = user
        next()
    }
    else{
        res.send("You need to login first!")
    }
}


module.exports = isAuthenticated