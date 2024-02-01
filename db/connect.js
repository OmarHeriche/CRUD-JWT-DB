const mongoose= require('mongoose');

const connectDB = (connectionString)=>{
    console.log("connected to the db success fully :)");
    return mongoose.connect(connectionString);
}

module.exports=connectDB;