import Section from "../models/SectionModel.js";
import Course from "../models/CourseModel.js";
import SubSection from "../models/SubSectionModel.js";

// create section 
export const createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties",
      });
    }

    const newSection = await Section.create({ sectionName, subSection: [] });

    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );

    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Create section error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create section, please try again",
      error: error.message,
    });
  }
};

// update section 
export const updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties",
      });
    }

    await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    let updatedCourse = null;
    if (courseId) {
      updatedCourse = await Course.findById(courseId)
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec();
    }

    return res.status(200).json({
      success: true,
      message: "Section Updated successfully",
      data: updatedCourse,
      updatedCourse,
    });
  } catch (error) {
    console.error("Update section error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update section, please try again",
      error: error.message,
    });
  }
};

// delete Section
export const deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;

    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "SectionId and CourseId are required",
      });
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // if subSection exist, delete them
    if (section.subSection && section.subSection.length > 0) {
      await SubSection.deleteMany({
        _id: { $in: section.subSection },
      });
    }

    // Remove Section Reference from Course
    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });

    // Delete the Section 
    await Section.findByIdAndDelete(sectionId);

    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Section deleted Successfully",
      data: updatedCourse,
      updatedCourse,
    });
  } catch (error) {
    console.error("Delete Section Error : ", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete Section",
      error: error.message,
    });
  }
};