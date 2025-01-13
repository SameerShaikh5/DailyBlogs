const mongoose = require('mongoose')

const connectDB = async function (){
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 15000, // 15 seconds
        })
        console.log('Mongodb connected!!')
    } 
    catch(err){
        console.log("Mongodb connection failed", err.message)
    }
}

module.exports = connectDB