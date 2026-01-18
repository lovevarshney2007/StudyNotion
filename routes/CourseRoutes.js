import express from "express";
import {createCourse,editCourse,getAllCourse,getCourseDetails,getFullCourseDetails,getInstructorCourses,deleteCourse} from "../controllers/CourseController.js";

import {createCategory,showAllCategory,categoryPageDetails} from "../controllers/CategoryController.js"

import {createSection,updateSection,deleteSection} from "../controllers/SectionController.js"

import {createSubSection,updateSubSection,deleteSubSection} from "../controllers/SubSectionController.js"

import {createRating,getAverageRating,getAllRatingReview} from '../controllers/RatingAndReveiw.js'

import {updateCourseProgress,getProgressPercentage} from "../controllers/courseProgress.js"

import {auth,isInstructor,isAdmin, isStudent} from "../middlewares/authMiddleware.js"

const router = express.Router();

// Category routes
router.post("/createCategory",auth,isAdmin,createCategory);
router.post("/showAllCategories",showAllCategory);
router.post("/getCategoryPageDetails",categoryPageDetails);

// Course routes
router.post("/createCourse",auth,isInstructor,createCourse);
router.post("/editCourse",auth,isInstructor,editCourse);
router.get("/getAllCourses",getAllCourse);
router.post("/getCourseDetails",getCourseDetails)
router.post("/getFullCourseDetails",auth,getFullCourseDetails);
router.post("/updateCourseProgress",auth,isStudent,updateCourseProgress);
router.delete("/deleteCourse",deleteCourse);

router.get("/getInstructorCourses",auth,isInstructor,getInstructorCourses);

// Section routes
router.post("/addSection",auth,isInstructor,createSection);
router.post("/updateSection",auth,isInstructor,updateSection);
router.post("/deleteSection",auth,isInstructor,deleteSection);

// SubSection Routes
router.post("/updateSubSection",auth,isInstructor,updateSubSection)
router.post("/deleteSubSection",auth,isAdmin,deleteSubSection);
router.post("/addSubSection",auth,isInstructor,createSubSection),

// Rating And Review course
router.post("/createRating",auth,isStudent,createRating);
router.get("/getAverageRating",getAverageRating);
router.get("/getReviews",getAllRatingReview);

export default router;