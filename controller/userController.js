const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const getRegister = async (req,res)=>{
    res.render('register')
}

const postRegister = async (req,res)=>{
    
    let {name, email, password} = req.body
    email = email.toLowerCase();

    if(!name || !email || !password){
        return res.send("Please enter credentials.")
    }

    let existinguser = await userModel.findOne({email:email})
    if(existinguser){
        return res.send('user Already Exists!!')
    }

    try{
        
        let hash = await bcrypt.hash(password, 10)
        let user = await userModel.create({
            name,
            email,
            password:hash,
        })

        //If its the very first user
        let allUsers = await userModel.find()
        if (allUsers.length == 1){
            user.isAdmin = true
            await user.save()
        }

        let token = jwt.sign({email:email}, process.env.JWT_SECRET_TOKEN)
        res.cookie('token', token)
        return res.redirect('/')
    }
    catch(err){
        console.log(err.message)
    }
}

const getLogin =  async (req,res)=>{
    res.render('login')
}

const postLogin = async(req,res)=>{
    let {email, password} = req.body
    if(!email || !password){
        return redirect('/users/login')
    }
    try{
        let user = await userModel.findOne({email:email})
        if (!user){
            return res.send('User not found!')
        }
        let result = await bcrypt.compare(password, user.password)
        if (result == true){
            let token = jwt.sign({email:email}, process.env.JWT_SECRET_TOKEN, { expiresIn: '1h' })
            res.cookie("token", token)
            return res.redirect('/')
        }
        else{
            res.send("Incorret credentials")
        }
    }
    catch(err){
        console.log(err.message)
    }
}

const logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/users/login')
}

module.exports = {getRegister, postRegister, getLogin, postLogin, logout}