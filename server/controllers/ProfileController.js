import Course from "../models/CourseModel.js";
import Profile from "../models/ProfileModel.js";
import User from "../models/UserModel.js";
import CourseProgress from "../models/CourseProgressModel.js";
import uploadImageToCloudinary from "../utils/imageUploader.js";
import convertSecondsToDuration from "../utils/SecToDuration.js";
import mongoose from "mongoose";

// update Profile 
export const updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", about = "", contactNumber = "", gender = "" } = req.body;
    const id = req.user.id;

    // find profile 
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // update profile 
    if (profileDetails) {
      if (dateOfBirth) profileDetails.dateOfBirth = dateOfBirth;
      if (about) profileDetails.about = about;
      if (gender) profileDetails.gender = gender;
      if (contactNumber) profileDetails.contactNumber = contactNumber;
      await profileDetails.save();
    }

    const updatedUserDetails = await User.findById(id).populate("additionalDetails");

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Error in updating Profile",
      error: error.message,
    });
  }
};

// Export alias for backward compatibility
export const updatePofile = updateProfile;

// delete Account 
export const deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // delete profile 
    await Profile.findByIdAndDelete(userDetails.additionalDetails);

    // Unenroll user from all enrolled courses
    await Course.updateMany(
      { _id: { $in: userDetails.courses } },
      { $pull: { studentEnrolled: id } }
    );

    // Delete course progress records
    await CourseProgress.deleteMany({ userId: id });

    // delete user
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be deleted",
      error: error.message,
    });
  }
};

// get all User Details 
export const getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.status(200).json({
      success: true,
      message: "User Data Fetched Successfully",
      data: userDetails,
    });
  } catch (error) {
    console.error("Get user details error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// updateDisplayPicture
export const updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files?.displayPicture;
    const userId = req.user.id;

    if (!displayPicture) {
      return res.status(400).json({
        success: false,
        message: "Display picture is required",
      });
    }

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    ).populate("additionalDetails");

    return res.status(200).json({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Update display picture error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getEnrolledCourses
export const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    const enrolledCourses = [];
    const courses = userDetails.courses || [];

    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      let totalDurationInSeconds = 0;
      let totalSubsections = 0;

      const contents = course.courseContent || [];
      for (let j = 0; j < contents.length; j++) {
        const subSections = contents[j].subSection || [];
        totalSubsections += subSections.length;
        for (let k = 0; k < subSections.length; k++) {
          totalDurationInSeconds += parseInt(subSections[k].timeDuration) || 0;
        }
      }

      const courseProgress = await CourseProgress.findOne({
        courseId: course._id,
        userId: userId,
      });

      const completedCount = courseProgress?.completedVideos?.length || 0;
      let progressPercentage = 0;
      if (totalSubsections === 0) {
        progressPercentage = 100;
      } else {
        const multiplier = Math.pow(10, 2);
        progressPercentage =
          Math.round((completedCount / totalSubsections) * 100 * multiplier) /
          multiplier;
      }

      enrolledCourses.push({
        ...course.toObject(),
        totalDuration: convertSecondsToDuration(totalDurationInSeconds),
        progressPercentage,
      });
    }

    return res.status(200).json({
      success: true,
      data: enrolledCourses,
    });
  } catch (error) {
    console.error("Get enrolled courses error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// instructorDashboard
export const instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentEnrolled?.length || 0;
      const totalAmountGenerated = totalStudentsEnrolled * (course.price || 0);

      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      };

      return courseDataWithStats;
    });

    return res.status(200).json({
      success: true,
      courses: courseData,
      data: courseData,
    });
  } catch (error) {
    console.error("Instructor dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
