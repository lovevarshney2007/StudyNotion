import express from "express"
import { isStudent,isInstructor,isAdmin,auth } from "../middlewares/authMiddleware";

import {capturePayment,verifyPayment} from "../controllers/PaymentController.js"

const router = express.Router();

router.post("/capturePayment",auth,isStudent,capturePayment)
router.post("/verifySignature",auth,isStudent,verifyPayment)

export default router;