import express from "express";
import { auth, isAdmin } from "../middlewares/authMiddleware.js";
import {
  getPlatformStats,
  getAllUsers,
  getAllInstructors,
  getAllCoursesAdmin,
  toggleUserStatus,
  deleteCourseAdmin,
} from "../controllers/AdminController.js";

const router = express.Router();

router.get("/stats", auth, isAdmin, getPlatformStats);
router.get("/users", auth, isAdmin, getAllUsers);
router.get("/instructors", auth, isAdmin, getAllInstructors);
router.get("/courses", auth, isAdmin, getAllCoursesAdmin);
router.patch("/user/:userId/toggle-status", auth, isAdmin, toggleUserStatus);
router.delete("/course/:courseId", auth, isAdmin, deleteCourseAdmin);

export default router;
