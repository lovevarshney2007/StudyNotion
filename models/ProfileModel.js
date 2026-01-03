import mongoose, { Mongoose } from "mongoose";

const profileSchema = new mongoose.Schema({
    gender:{
        type:String,
        enum:["Male","Female"],
        required:true
    },
    dateOfBirth:{
        type:Number,
        require:true,
    },
    contactNumber:{
        type:"Number",
        require:true,
        trim:true
    }

})

module.exports = mongoose.model("Profile",profileSchema)