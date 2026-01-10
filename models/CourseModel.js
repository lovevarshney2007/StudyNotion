import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        required:true,
        trim:true
    },
    courseDescription:{
        type:String,
        trim:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    whatYouWillLearn: {
        type:String
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
        }
    ],
    ratingAndReview:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"ratingAndReview",
        }
    ],
    price:{
        type:Number
    },
    thumbnail:{
        type:String,
    },
    tags:{
        type:[Sting],
        required:true,
    },
    Category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    studentEntrolled: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }],
     instructions:{
        type:[string]
    },
    status:{
        type:String,
        enum:["Draft","Published"],
    },
    
})

const Course = mongoose.model("Course",courseSchema);
export default Course;