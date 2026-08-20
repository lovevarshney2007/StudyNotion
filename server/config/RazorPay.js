import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY || "rzp_test_placeholder",
    key_secret: process.env.RAZORPAY_SECRET || "placeholder_secret"
});