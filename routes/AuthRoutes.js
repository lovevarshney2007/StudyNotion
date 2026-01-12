import express from "express"
import {sendOtp,signUp,login,changePassword}  from "../controllers/AuthController"

import {auth} from "../middlewares/authMiddleware.js"

const router = express.Router();

// public routes 
router.post("/send-otp", sendOTP);
router.post("/signup", signUp);
router.post("/login", login);

// protected route
router.post("/change-password", auth, changePassword);

export default router;   