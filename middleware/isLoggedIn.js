const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')

async function isLoggedIn(req,res,next){
        res.locals.isadmin = false
        try{
            if (req.cookies.token){
                if (req.path == "/users/register" || req.path == "/users/login"){
                    return res.redirect('/')
                }
                res.locals.isloggedin = true;
            
                let data = jwt.verify(req.cookies.token, process.env.JWT_SECRET_TOKEN)
                let user = await userModel.findOne({email:data.email}).select('-password')
                req.user = user
                if (user.isAdmin == true){
                    res.locals.isadmin = true
                }
            }
            else{
                res.locals.isloggedin = false;
            }
    }
    catch(err){
        if(err.name == "TokenExpiredError"){
            res.locals.isloggedin = false;
            res.clearCookie('token')
            req.flash('message', {text:"Session Expired!. Please Login Again.", type:'danger'})
            return res.redirect('/users/login')
        }
        console.log(err.message)
        return res.send("Something went wrong!!")
    }
    next();
}

module.exports = isLoggedIn