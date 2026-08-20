import mongoose from "mongoose";

const CourseProgressSchema = new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    completedVideos: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
        }
    ]
}, { timestamps: true });

const CourseProgress = mongoose.model("CourseProgress",CourseProgressSchema);
export default CourseProgress;