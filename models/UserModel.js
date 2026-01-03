import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        require:true,
        trim:true
    },
    lastName:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true
    },
    password:{
        type:String,
        require:true
    },
    confirmPassword:{
        type:String,
        require:true
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        require:true
    },
    contactNumber:{
        type:Number,
        required:true
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"Profile",
    },
    couses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Courses"
        }
    ],
    image:{
        type:String,
        require:true,
        trim:true
    },
    
    couseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress",
        }
    ],
});

module.exports = mongoose.model("User",userSchema)