const mongoose = require('mongoose')

const connectDB = async function (){
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}`, {
            serverSelectionTimeoutMS: 15000,
        })
        console.log('Mongodb connected!!')
    } 
    catch(err){
        console.log("Mongodb connection failed", err.message)
    }
}

module.exports = connectDB
