import Course from "../models/CourseModel.js";
import Profile from "../models/ProfileModel.js";
import User from "../models/UserModel.js";
import uploadImageToCloudinary from "../utils/imageUploader.js";
import dotenv from "dotenv";

export const updatePofile = async (req, res) => {
  try {
    // get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    // get Userid
    const id = req.user.id;
    // validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await ProfileModel.findById(profileId);

    // update profile
    profileDetails.dateOfBirth = new Date(dateOfBirth);
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
  
    await profileDetails.save();

    // return response
    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in profileController",
      error: error.message,
    });
  }
};

// delete Account
// Explore -> how can we schedule this deletion user

export const deleteAccount = async (req, res) => {
  try {
    // get id
    const id = req.user.id;

    // validation
    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    // delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    // todo: hw uneroll user from all enrolled courses

    // delete user
    await User.findByIdAndDelete({ _id: id });

    // return res
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while deleteing account ",
    });
  }
};

// crown jop

export const getAllUserDetails = async (req, res) => {
  try {
    // get id
    const  id  = req.user.id;

    // validation and user details
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    // return res
    return res.status(200).json({
      success: true,
      message: "User Data Fetched Successfully",
      userDetails
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    // upload to cloudinary
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);

    // update profile
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    // return response
    res.send({
      success: true,
      message: "Image successfully updated",
      data: {
        updatePofile,
        image
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getEnrolledCourses
export const getEnrolledCourses = async (req, res) => {
  try {
    //get user id 
    const userId = req.user.id;
    // find the user
    let courseDetails = await User.findOne({
      _id:userId,
    })
    .populate({
      path:"courses",
      populate:{
        path:"courseContent",
        populate:{
          path:"subSection",
        }
      }
    })
    .exec();
    // continue later
  } catch (error) {
    
  }
};
// Instructor dashword for payment amount
export const instructorDashword = async(req,res) => {
  try {
    // fetch insturtor course details
    const courseDetails = await Course.find({
      instructor:req.user.id
    });
    
    // Fetch data 
    const courseData = courseDetails.map((course) => {
      const totalStudentEnrolled = course.studentEntrolled.length;
      const totalAmountGenerated = totalStudentEnrolled.course.price;

   

    const courseDataWithStats = {
      _id:Course._id,
      courseName:Course.courseName,
      courseDescription:Courseurse.courseDescription,
      totalStudentEnrolled,
      totalAmountGenerated
    };
    return courseDataWithStats;

     });
  

    // return response 
    return res.status(200).json({
      course:courseData
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:"Internal Server error in instrucor dashword "
    })
  }
}