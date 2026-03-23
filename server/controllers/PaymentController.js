import crypto from "crypto";
import mongoose from "mongoose";
import  {instance}  from "../config/RazorPay.js";
import Course from "../models/CourseModel.js";
import User from "../models/UserModel.js";
import mailSender from "../utils/mailSender.js";
import  courseEntrollmentEmail  from "../mail/templates/courseEntrollmentEmail.js";
import paymentSuccessEmail from "../mail/templates/passwordSuccessEmail.js"

export const capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (!courses || courses.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide course id",
    })
  }

  let totalAmount = 0;
  for (const courseId of courses) {
    try {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Could not find the course",
        })
      }

      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentEnrolled.includes(uid)) {
        return res.status(409).json({
          success: false,
          message: "Student is already Enrolled",
        })
      }

      totalAmount += course.price || 0;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  try {
    const paymentResponse = await instance.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    });

    return res.status(200).json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Could not initiate Order" });
  }
}

export const verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Payment Failed",
    })
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Payment Verification Failed",
    })
  }

  await enrollStudents(courses, userId, res);
  return res.status(200).json({
    success: true,
    message: "Payment Verified",
  })
}

export const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide data for courses or userId",
    })
  }

  for (const courseId of courses) {
    try {
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $addToSet: { studentEnrolled: userId } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        })
      }

      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { courses: courseId } },
        { new: true }
      )

      await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEntrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
}

export const SendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({ success: false, message: "Please Provide all the fields" })
  }

  try {
    const enrolledStudent = await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      "Payment Received SuccessFully",
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )

    return res.status(200).json({
      success: true,
      message: "Payment confirmation email sent",
    })
  } catch (error) {
    console.log("Error in sending email", error);
    return res.status(500).json({ success: false, message: "Could not send email" })
  }
}
