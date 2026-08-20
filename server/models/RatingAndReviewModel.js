import mongoose from "mongoose";

const ratingAndReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

// prevent duplicate review by same user on same course
ratingAndReviewSchema.index({ user: 1, course: 1 }, { unique: true });

const ratingAndReview = mongoose.model(
  "RatingAndReview",
  ratingAndReviewSchema
);
export default ratingAndReview;
