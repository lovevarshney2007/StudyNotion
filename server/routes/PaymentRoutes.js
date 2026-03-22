import express from "express"
import { auth, isStudent } from "../middlewares/authMiddleware.js"
import {
  capturePayment,
  verifyPayment,
  SendPaymentSuccessEmail,
} from "../controllers/PaymentController.js"

const router = express.Router();

router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment", auth, isStudent, verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent, SendPaymentSuccessEmail)

export default router;
