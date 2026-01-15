import express from "express";
import {createCourse,editCouse,getAllCourse,getCourseDetails,getFullCourseDetails} from "../controllers/CourseController.js";

import {createCategory,showAllCategory,categoryPageDetails} from "../controllers/CategoryController.js"

import {createSection,updateSection,deteleSection} from "../controllers/SectionController.js"

import {createSubSection} from "../controllers/SubSectionController.js"


import {auth,isInstructor} from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/createCourse",auth,isInstructor,createCourse);

export default router;