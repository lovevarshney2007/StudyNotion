import mongoose from "mongoose";
import Course from "../models/CourseModel"
import RatingAndReview from "../models/RatingAndReviewModel"

// create rating controller
exports.createRating = async (req,res) => {
    try {
        // get user id 
        const userid = req.body;

        // fetch data from req
        const {rating,review,courseId} = req.body;
        // check if user is enrolled or not 
        const courseDeatails = await Course.findOne(
            {_id:courseId,
            studentEnrolled:{$eleMatch:{$eq:userid}},

            } 
        )

        if(!courseDeatails){
            return res.status(404).json({
                sucess:false,
                message:"Student is not enrolled in the course"
            })
        }
        // check if user is reviewed the course 
        const  alreadyReviewed = await RatingAndReview.findOne({
            user:userid,
            course:courseId
        })
         if(alreadyReviewed){
            return res.status(403).json({
                sucess:false,
                message:"Course is already rated by user"
            })
        }
        // check rating and review 
       const ratingReview = await RatingAndReview.create({
        rating,review,
        course:courseId,
        user:userid
       })
        // update course with rating / raview
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
        {
            $push:{
                RatingAndReview:ratingReview._id,
            }
        },{
            new:true
        });
        console.log(updatedCourseDetails)
        // return response
        return res.status(200).json({
            sucess:true,
            message:"Rating and reviewed Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            sucess:false,
            message:error.message
        })
    }
}

// getAverage rating 
exports.getAverageRating = async (req,res) => {
    try {
        // get CourseId
        const courseId = req.body.courseId;
        // calulate Average Rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                }
            },{
                $group:{
                    _id:null,
                    averageRating: {$avg:"$rating"},
                }
            }
        ])
        // return rating
        if(result.length > 0){
            return res.status(200).json({
                sucess:true,
                averageRating:result[0].averageRating
            })
        }
        // if no rating / review exist  
        return res.status(200).json({
            success:true,
            message:"Average rating is 0 , no rating given till now ",
            averageRating:0
        })
    } catch (error) {
         console.log(error)
        return res.status(500).json({
            sucess:false,
            message:error.message
        })
    }
}

// getAllRatingAndReview
exports.getAllRating = async (req,res) => {
    try {
        const allReview = await RatingAndReview.find({})
                                               .sort({rating:"desc"})
                                               .populate({
                                                path:"user",
                                                select:"firstName lastName email image"
                                               })
                                               .populate({
                                                path:"course",
                                                select:"courseName",
                                               })
                                               .exec();
         return res.status(200).json({
            success:true,
            message:"All review fetched Successfully",
            data:allReview
         });
    } catch (error) {
          console.log(error)
        return res.status(500).json({
            sucess:false,
            message:error.message
        })
    }
}