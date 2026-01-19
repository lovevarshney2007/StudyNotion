import Category from "../models/CategoryModel.js"
import Course from "../models/CourseModel.js";
import CourseProgress from "../models/CourseProgressModel.js";
import Section from "../models/SectionModel.js";
import SubSection from "../models/SubSectionModel.js";
import User from "../models/UserModel.js";
import  uploadImageToCloudinary  from "../utils/imageUploader.js";

// creting course

export const createCourse = async (req, res) => {
  try {
    // fetching data
    const userId = req.user.id

    let { courseName, courseDescription, whatYouWillLearn, price, tag:_tag,category,status,instructions:_instructions } =
      req.body;

    // get thumbail
    const thumbnail = req.files.thumbnailImage;

    const tag = JSON.parse(_tag);
    const instructions = JSON.parse(_instructions)

    console.log("tag", tag)
    console.log("instructions", instructions)

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail || 
      !category ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if(!status || status === undefined){
      status = "Draft"
    }

    // check for instructor
    
    const instructorDetails = await User.findById(userId,{
      accountType:"Instructor",
    });
    

    console.log("instructor Detail : ", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    // check given tag is valid or not
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category details not found",
      });
    }

    // upload Thumbnail Top CLoudinary
    const thumbanailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    console.log(thumbanailImage)

    // create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      category: categoryDetails._id,
      thumbnail: thumbanailImage.secure_Url,
      status,
      instructions
    });

    // add the new Course to the user schema of Instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );
    
    

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

// Edit course details 
export const editCourse = async (req,res) => {
  try {
    const {courseId} = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if(!course){
      return res.status(404).json({
        success:false,
        message:"Course not found"
      })
    }

    // if thumnail Image is found , update it 
    if(req.file){
      console.log("thumbnail update")
      const thumbnail = req.files.thumbanailImage
      const thumbnailImage = uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update the fields that are present in the request body 
    for(const key in updates){
      if(updates.hasOwnProperty(key)){
        if(key === "tag" || key === "instructions"){
          course[key] = JSON.parse(updates[key])
        }else{
          course[key] = updates[key]
        }
      }
    }
    await course.save()

    const updatedCourse = await Course.findOne({
      _id:courseId,
    })
    .populate({
      path:"Instructor",
      populate:{
        path:"additionalDetails"
      },
    })
    .populate("category")
    .populate("RatingAndReview")
    .populate({
      path:"courseContent",
      populate:{
        path:"subSection",
      }
    })
    .exec()
    
    // return response
    return res.json ({
      success:true,
      message:"Course updates Successfully",
      data:updatedCourse
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success:false,
      message:"Internal Server Error",
      error:error.message
    })
  }
}

// get course list 
export const getAllCourse = async (req,res) => {
  try {
    const allCourses = await Course.find(
      {status:"Published"},{
        courseName:true,
        price:true,
        thumbnail:true,
        instructor:true,
        ratingAndReviews:true,
        studentEnrolled:true
      }
    )
    .populate("instructor")
    .exec()
    
    // return response 
    return res.status(200).json({
      success:true,
      data:allCourses,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    })
  }
}

// get all course 
export const getCourseDetails = async (req,res) => {
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
    .populate("ratingAndReviews")
    .populate({
      path:"courseContent",
      populate:{
        path:"subSection",
        select:"-videoUrl",
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

    let totalDurationInSeconds = 0
    courseDeatails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    // return response
    return res.status(200).json({
      success:true,
      message:"Course Deatils is Fetched Successfully",
      data:{
        courseDeatails,
        totalDuration,
      }
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      message:error.message

    })
  }
}

// get full Course Details 
export const getFullCourseDetails = async (req,res) => {
  try {
    const {courseId} = req.body
    const userId = req.user.id
    const courseDeatails = await Course.findOne({
      _id:courseId
    })
    .populate({
      path:"instructor",
      populate:{
        path:"additionalDetails",
      }
    })
    .populate("category")
    .populate("ratingAndReviews")
    .populate({
      path:"courseContent",
      populate:{
        path:"subSection",
      },
    })
    .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseId:courseId,
      userId:userId,
    })
     console.log("courseProgressCount : ", courseProgressCount)

     if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
export const getInstructorCourses = async (req,res) => {
  try {
    const instructorId = req.user.id;

    const isInstructorCourse = await Course.find({
      instructor:instructorId
    })
    .sort({createdAt: -1})
    .populate({
      path:"courseContent",
      populate:{
        path:"subSection",
      }
    })
    .exec();

    res.status(200).json({
      success:true,
      data:isInstructorCourse,
      
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success:false,
      message:"Failed To Retrive instructor Course",
      error:error.message
    })
  }
}

// Delete the Course
export const deleteCourse = async (req,res) => {
  try {
    
    const {courseId} = req.body;

    const course = await Course.findById(courseId);
    if(!course){
      return res.status(404).json({
        success:false,
        message:"Course Not Found"
      })
    }

    const studentEnrolled = course.studentEntrolled;
    for(const studentId of studentEnrolled){
      await User.findByIdAndUpdate(studentId,{
        $pull:{courses:courseId},
      });
    }

    const courseSections = course.courseContent;
    for(const sectionId of courseSections){
      const section = await Section.findById(sectionId);

      if(section){
        const subSections = section.subSection;
        for(const subSectionId of subSections){
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      await Section.findByIdAndDelete(sectionId);
    }
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success:true,
      message:"Course deleted Successfully",
    });


  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success:false,
      message:"Server Error during deletion course",
      error:error.message
    })
  }
}

