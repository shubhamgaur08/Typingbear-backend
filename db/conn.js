const mongoose = require("mongoose");

const DB = process.env.DATABASE;
mongoose.set('strictQuery', false);
mongoose.connect(DB,{
}).then(()=>{
    console.log("connection successfull");
}).catch((err)=>{
    console.log(err);
})