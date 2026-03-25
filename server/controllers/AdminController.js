import User from "../models/UserModel.js";
import Course from "../models/CourseModel.js";
import Category from "../models/CategoryModel.js";

// GET /api/v1/admin/stats
export const getPlatformStats = async (req, res) => {
  try {
    const [totalStudents, totalInstructors, totalCourses, totalCategories] =
      await Promise.all([
        User.countDocuments({ accountType: "Student" }),
        User.countDocuments({ accountType: "Instructor" }),
        Course.countDocuments(),
        Category.countDocuments(),
      ]);

    const publishedCourses = await Course.countDocuments({ status: "Published" });
    const draftCourses = await Course.countDocuments({ status: "Draft" });

    // Calculate total revenue across all published courses
    const courses = await Course.find({ status: "Published" }, { price: 1, studentEnrolled: 1 });
    const totalRevenue = courses.reduce(
      (sum, c) => sum + (c.price || 0) * (c.studentEnrolled?.length || 0),
      0
    );

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalInstructors,
        totalCourses,
        totalCategories,
        publishedCourses,
        draftCourses,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch platform statistics" });
  }
};

// GET /api/v1/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, {
      firstName: 1, lastName: 1, email: 1, accountType: 1,
      image: 1, active: 1, createdAt: 1, courses: 1,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// GET /api/v1/admin/instructors
export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ accountType: "Instructor" }, {
      firstName: 1, lastName: 1, email: 1, image: 1, courses: 1, createdAt: 1,
    }).populate("courses", "courseName price studentEnrolled status")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: instructors });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch instructors" });
  }
};

// GET /api/v1/admin/courses
export const getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate("instructor", "firstName lastName email")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
};

// PATCH /api/v1/admin/user/:userId/toggle-status
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.active = !user.active;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.active ? "activated" : "deactivated"} successfully`,
      data: { active: user.active },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to toggle user status" });
  }
};

// DELETE /api/v1/admin/course/:courseId
export const deleteCourseAdmin = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Remove from instructor's course list
    await User.findByIdAndUpdate(course.instructor, { $pull: { courses: courseId } });
    // Remove from enrolled students
    await User.updateMany({ courses: courseId }, { $pull: { courses: courseId } });

    return res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete course" });
  }
};
