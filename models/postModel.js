const mongoose = require('mongoose')

const PostModel = mongoose.Schema({
    image:Buffer,
    heading:String,
    subheading:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    content:String,
    createdAt: { type: Date, default: Date.now },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ]
})

module.exports = mongoose.model('post', PostModel)