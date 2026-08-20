import mongoose from "mongoose";
import Course from "../models/CourseModel.js";
import RatingAndReview from "../models/RatingAndReviewModel.js";

// create rating controller
export const createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, courseId } = req.body;

    if (!rating || !review || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Rating, review, and courseId are required",
      });
    }

    // check if user is enrolled
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentEnrolled: userId,
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }

    // check if user already reviewed the course 
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewed by user",
      });
    }

    // create rating and review
    const ratingReview = await RatingAndReview.create({
      rating: Number(rating),
      review,
      course: courseId,
      user: userId,
    });

    // update course with rating / review
    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          ratingAndReview: ratingReview._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Rating and review added successfully",
      ratingReview,
    });
  } catch (error) {
    console.error("Create rating error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getAverage rating 
export const getAverageRating = async (req, res) => {
  try {
    const courseId = req.body?.courseId || req.query?.courseId;
    if (!courseId) {
      return res.status(200).json({
        success: true,
        message: "Average rating is 0",
        averageRating: 0,
      });
    }

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: Math.round(result[0].averageRating * 10) / 10,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Average rating is 0, no rating given till now",
      averageRating: 0,
    });
  } catch (error) {
    console.error("Get average rating error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getAllRatingAndReview
export const getAllRating = async (req, res) => {
  try {
    const allReview = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "All reviews fetched Successfully",
      data: allReview,
    });
  } catch (error) {
    console.error("Get all ratings error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
