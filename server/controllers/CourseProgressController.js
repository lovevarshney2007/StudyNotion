import SubSection from "../models/SubSectionModel.js";
import CourseProgress from "../models/CourseProgressModel.js";
import User from "../models/UserModel.js";

// Course Progress
export const updateCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.body;
    const subSectionId = req.body.subsectionId || req.body.subSectionId || req.body.SubSectionId;
    const userId = req.user.id;

    if (!courseId || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "Course ID and Subsection ID are required",
      });
    }

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "Invalid SubSection",
      });
    }

    let courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      // Auto-create if not present
      courseProgress = await CourseProgress.create({
        courseId: courseId,
        userId: userId,
        completedVideos: [subSectionId],
      });

      await User.findByIdAndUpdate(userId, {
        $push: { courseProgress: courseProgress._id },
      });

      return res.status(200).json({
        success: true,
        message: "Course progress updated",
      });
    } else {
      const alreadyCompleted = courseProgress.completedVideos.some(
        (id) => id.toString() === subSectionId.toString()
      );

      if (alreadyCompleted) {
        return res.status(200).json({
          success: true,
          message: "Subsection already completed",
        });
      }

      courseProgress.completedVideos.push(subSectionId);
      await courseProgress.save();

      return res.status(200).json({
        success: true,
        message: "Course progress updated",
      });
    }
  } catch (error) {
    console.error("Course progress update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
