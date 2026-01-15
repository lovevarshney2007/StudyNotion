import express from "express"
import { auth,isInstructor} from "../middlewares/authMiddleware.js"
import {updatePofile,deleteAccount,getAllUserDetails,updateDisplayPicture,getEnrolledCourses} from "../controllers/ProfileController.js"

const router = express.Router();

router.delete("/deleteProfile",auth,deleteAccount)
router.put("/updateProfile",auth,updatePofile);
router.get("/getUserDetails",auth,getAllUserDetails)
router.put("/updateDisplayPicture",auth,updateDisplayPicture);

export default router;