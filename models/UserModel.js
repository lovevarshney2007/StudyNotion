import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true
    },
    contactNumber:{
        type:Number,
        required:true
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
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
        required:true,
        trim:true
    },
    token : {
        type:String,
        required:true
    },
    resetPasswordExpire:{
        type:Date
    },
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress",
        }
    ],
});

const User = mongoose.model("User",userSchema)
export default User;