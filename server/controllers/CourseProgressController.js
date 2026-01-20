import mongoose from "mongoose";
import Section from "../models/SectionModel.js";
import SubSection from "../models/SubSectionModel.js";
import CourseProgress from "../models/CourseProgressModel.js";
import Course from "../models/CourseModel.js";

// Course Progress
export const updateCourseProgress = async (req, res) => {
  try {
    const { courseId, SubSectionId } = req.body;
    const userId = req.user.id;

    console.log(req.body);
    const subSection = await SubSection.findById(SubSectionId);
    if(!subSection){
        return res.status(404).json({
            success:false,
            message:"Invalid SubSection"
        })
    }

    let courseProgress = await CourseProgress.findOne(
        {courseId:courseId,
            userId:userId,
        }
    );

    if(!courseProgress){
        return res.status(404).json({
            success:false,
            message:"Course Progress Does not exist"
        })
    }
    else {
        
        if(courseProgress.completedVideos.includes(SubSectionId)){
            return res.status(400).json({
                error:"Subsection already completed"
            })
        }
        courseProgress.completedVideos.push(SubSectionId);
    }
    await courseProgress.save();
    return res.status(200).json({
        message:"Course progress updated"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
