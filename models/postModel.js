const mongoose = require('mongoose')

const PostModel = mongoose.Schema({
    image:String,
    heading:{
        type:String
    },
    subheading:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    content:{
        type:String
    },
    createdAt: { type: Date, default: Date.now },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ]
})

module.exports = mongoose.model('post', PostModel)