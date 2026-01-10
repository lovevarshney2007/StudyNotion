import mongoose from "mongoose";

const ratingAndReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
    trim: true,
    min: 1,
      max: 5,
  },
  
}, { timestamps: true });


// prevent duplicate review by same user on same course
ratingAndReviewSchema.index({ user: 1, course: 1 }, { unique: true });

const ratingAndReview = mongoose.model(
  "ratingAndReview",
  ratingAndReviewSchema
);
export default ratingAndReview;
