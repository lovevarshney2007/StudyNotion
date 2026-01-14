import express from "express"
import  {sendOTP,signUp,login,changePassword}  from "../controllers/AuthController.js"

import {auth} from "../middlewares/authMiddleware.js"

const router = express.Router();

// public routes 
router.post("/send-otp", sendOTP);
router.post("/signup", signUp);
router.post("/login", login);

// protected route
router.post("/change-password", auth, changePassword);

export default router;   