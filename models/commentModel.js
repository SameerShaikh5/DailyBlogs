const mongoose = require('mongoose')

const CommentModel = mongoose.Schema({
    comment:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    commentedOnPost:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    },
    date:{ type: Date, default: Date.now },
})

module.exports = mongoose.model('comment', CommentModel)