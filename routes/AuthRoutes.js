import express from "express"
import  {sendOTP,signUp,login,changePassword}  from "../controllers/AuthController.js"

import {auth} from "../middlewares/authMiddleware.js"

import {resetPasswordToken,resetPassword} from "../controllers/ResetPasswordController.js"

const router = express.Router();

// public routes 
router.post("/send-otp", sendOTP);
router.post("/signup", signUp);
router.post("/login", login);

// protected route
router.post("/changepassword", auth, changePassword);
router.post("/reset-password-token",resetPasswordToken)
router.post("/reset-password",resetPassword)

export default router;   