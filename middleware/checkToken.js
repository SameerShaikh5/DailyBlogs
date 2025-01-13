function checkToken(req,res,next){
    if (req.cookies.token){
        if (req.path == "/users/register" || req.path == "/users/login"){
        return res.redirect('/')
        }
    }
    next()
}

module.exports = checkToken