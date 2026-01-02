import mongoose, { mongo } from "mongoose";

const ratingAndReviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User",
    },
    rating:{
        type:Number,
        require:true,
    },
    review:{
        require:true, 
    }
});

module.exports = mongoose.model("RatingAndReview",ratingAndReviewSchema)