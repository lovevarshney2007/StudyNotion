import e from "express";
import Course from "../models/CourseModel";
import Tag from "../models/TagsModel";
import User from "../models/UserModel";
import { uploadImageToCloudinary } from "../utils/imageUploader";

// creting course

exports.createCourse = async (req, res) => {
  try {
    // fetching data
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    // get thumbail
    const thumbnail = req.files.thumbnailImage;

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check for instructor
    const userid = req.user.id;
    const instructorDetail = await User.findById(userid);
    // todo: verify that userid and instructor_id are same or different ?

    console.log("instructor Detail : ", instructorDetail);

    if (!instructorDetail) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    // check given tag is valid or not
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag details not found",
      });
    }

    // upload Image Top CLoudinary
    const thumbanailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetail._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbanailImage.secure_Url,
    });

    // add the new Course to the user schema of Instructor
    await User.findById(
      { _id: instructorDetail._id },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );
    // update the tag ka schema
    // to do

    // return response

    return res.status(200).json({
      success: true,
      message: "Course Created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error during creating course",
      error: error.message,
    });
  }
};

// get all course handler function 

exports.showAllCourse = async  (req,res) => {
    try {
        // ToDO: change below code incremently
        const allCourses = await Course.find({},{
            courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentEnrolled:true,
        })
        .populate("instructor")
        .exex();

        return res.status(200).json({
            success:true,
            message:"daata fetch successfully"
        })


        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot fetch course data ",
            error:error.message
        })
    }
}

// get all course 
exports.getCourseDetails = async (req,res) => {
  try {
    // get id 
    const {courseId} = req.body;
    // find course detail
    const courseDeatails  = await Course.find(
      {_id:courseId}
    )
    .populate(
      {
         path:"instructor", 
         populate:{
          path:"additionalDetails",
         },
      }
    )
    .populate("category")
    .populate("ratingAndReview")
    .populate({
      path:"courseContent",
      populate:{
        path:"subSection"
      }
    })
     .exec();

    // validation 
    if(!courseDeatails ){
      return res.status(400).json({
        success:false,
        message:`Could not find the course with ${courseId}`
      });
    }
    // return response
    return res.status(200).json({
      success:true,
      message:"Course Deatils is Fetched Successfully",
      data:courseDeatails
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      message:error.message

    })
  }
}