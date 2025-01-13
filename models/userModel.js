const mongoose = require('mongoose')

const UserModel = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    isAdmin:{
        type:Boolean,
        default:false,
    },
})

module.exports = mongoose.model('user', UserModel)