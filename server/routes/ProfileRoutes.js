import express from "express"
import { auth,isInstructor} from "../middlewares/authMiddleware.js"
import {updatePofile,deleteAccount,getAllUserDetails,updateDisplayPicture,getEnrolledCourses,instructorDashboard} from "../controllers/ProfileController.js"

const router = express.Router();

router.delete("/deleteProfile",auth,deleteAccount)
router.put("/updateProfile",auth,updatePofile);
router.get("/getUserDetails",auth,getAllUserDetails);
router.get("/getEnrolledCourses",auth,getEnrolledCourses);
router.put("/updateDisplayPicture",auth,updateDisplayPicture);
router.get("/instructorDashboard",auth,isInstructor,instructorDashboard);

export default router;