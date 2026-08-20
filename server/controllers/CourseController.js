import Category from "../models/CategoryModel.js";
import Course from "../models/CourseModel.js";
import CourseProgress from "../models/CourseProgressModel.js";
import Section from "../models/SectionModel.js";
import SubSection from "../models/SubSectionModel.js";
import User from "../models/UserModel.js";
import uploadImageToCloudinary from "../utils/imageUploader.js";
import convertSecondsToDuration from "../utils/SecToDuration.js";

// creating course
export const createCourse = async (req, res) => {
  try {
    const userId = req.user.id;

    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      tags: _tags,
      category,
      status,
      instructions: _instructions,
    } = req.body;

    const thumbnail = req.files?.thumbnailImage;

    let tag = _tag || _tags;
    if (typeof tag === "string") {
      try {
        tag = JSON.parse(tag);
      } catch (e) {
        tag = [tag];
      }
    }
    if (!Array.isArray(tag)) tag = tag ? [tag] : [];

    let instructions = _instructions;
    if (typeof instructions === "string") {
      try {
        instructions = JSON.parse(instructions);
      } catch (e) {
        instructions = [instructions];
      }
    }
    if (!Array.isArray(instructions)) instructions = instructions ? [instructions] : [];

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      price === undefined ||
      !tag.length ||
      !thumbnail ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!status) {
      status = "Draft";
    }

    // check for instructor
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails || instructorDetails.accountType !== "Instructor") {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    // check given category is valid or not
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category details not found",
      });
    }

    // upload Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tags: tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status,
      instructions: instructions.length ? instructions : ["Course requirements will be listed soon"],
    });

    // add the new Course to the user schema of Instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // Add the new course to the Category
    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course Created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("Course creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Error during creating course",
      error: error.message,
    });
  }
};

// Edit course details 
export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only edit your own courses",
      });
    }

    // If thumbnail Image is found, update it 
    if (req.files && (req.files.thumbnailImage || req.files.thumbanailImage)) {
      const thumbnail = req.files.thumbnailImage || req.files.thumbanailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update the fields that are present in the request body 
    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        if (key === "tag" || key === "tags") {
          let parsedTag = updates[key];
          if (typeof parsedTag === "string") {
            try { parsedTag = JSON.parse(parsedTag); } catch (e) { parsedTag = [parsedTag]; }
          }
          course.tags = parsedTag;
        } else if (key === "instructions") {
          let parsedInstructions = updates[key];
          if (typeof parsedInstructions === "string") {
            try { parsedInstructions = JSON.parse(parsedInstructions); } catch (e) { parsedInstructions = [parsedInstructions]; }
          }
          course.instructions = parsedInstructions;
        } else if (key !== "courseId") {
          course[key] = updates[key];
        }
      }
    }
    await course.save();

    const updatedCourse = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Course updated Successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Edit course error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get course list 
export const getAllCourse = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        courseDescription: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReview: true,
        studentEnrolled: true,
        category: true,
      }
    )
      .populate("instructor", "firstName lastName email image")
      .populate("category", "name")
      .populate("ratingAndReview")
      .exec();

    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    console.error("Get all courses error:", error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};

// get course details
export const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find the course with id ${courseId}`,
      });
    }

    let totalDurationInSeconds = 0;
    (courseDetails.courseContent || []).forEach((content) => {
      (content.subSection || []).forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration) || 0;
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    // Note: frontend expects courseDetails, ratingAndReviews, studentsEnrolled
    return res.status(200).json({
      success: true,
      message: "Course Details Fetched Successfully",
      data: {
        courseDetails: {
          ...courseDetails.toObject(),
          ratingAndReviews: courseDetails.ratingAndReview,
          studentsEnrolled: courseDetails.studentEnrolled,
        },
        totalDuration,
      },
    });
  } catch (error) {
    console.error("Get course details error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get full Course Details 
export const getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    let courseProgressCount = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    let totalDurationInSeconds = 0;
    (courseDetails.courseContent || []).forEach((content) => {
      (content.subSection || []).forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration) || 0;
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails: {
          ...courseDetails.toObject(),
          ratingAndReviews: courseDetails.ratingAndReview,
          studentsEnrolled: courseDetails.studentEnrolled,
        },
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos || [],
      },
    });
  } catch (error) {
    console.error("Get full course details error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a list of Course for a given Instructor
export const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const isInstructorCourse = await Course.find({
      instructor: instructorId,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // Map to include studentsEnroled and studentsEnrolled aliases for frontend safety
    const formattedCourses = isInstructorCourse.map((c) => ({
      ...c.toObject(),
      studentsEnroled: c.studentEnrolled,
      studentsEnrolled: c.studentEnrolled,
    }));

    return res.status(200).json({
      success: true,
      data: formattedCourses,
    });
  } catch (error) {
    console.error("Get instructor courses error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed To Retrieve instructor Course",
      error: error.message,
    });
  }
};

// Delete the Course
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }

    // Check ownership or admin
    if (course.instructor.toString() !== userId && req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete your own courses",
      });
    }

    // Unenroll students from this course
    const studentEnrolled = course.studentEnrolled || [];
    for (const studentId of studentEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Remove from instructor
    await User.findByIdAndUpdate(course.instructor, {
      $pull: { courses: courseId },
    });

    // Remove from category
    if (course.category) {
      await Category.findByIdAndUpdate(course.category, {
        $pull: { courses: courseId },
      });
    }

    // Delete all sections and subsections
    const courseSections = course.courseContent || [];
    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection || [];
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete CourseProgress entries
    await CourseProgress.deleteMany({ courseId: courseId });

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted Successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error during deleting course",
      error: error.message,
    });
  }
};

