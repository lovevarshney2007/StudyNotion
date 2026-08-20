import crypto from "crypto";
import mongoose from "mongoose";
import { instance } from "../config/RazorPay.js";
import Course from "../models/CourseModel.js";
import User from "../models/UserModel.js";
import CourseProgress from "../models/CourseProgressModel.js";
import mailSender from "../utils/mailSender.js";
import courseEnrollmentEmail from "../mail/templates/courseEntrollmentEmail.js";
import paymentSuccessEmail from "../mail/templates/passwordSuccessEmail.js";

export const capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (!courses || courses.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide course id",
    });
  }

  let totalAmount = 0;
  for (const courseId of courses) {
    try {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Could not find the course",
        });
      }

      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentEnrolled && course.studentEnrolled.includes(uid)) {
        return res.status(409).json({
          success: false,
          message: "Student is already Enrolled",
        });
      }

      totalAmount += course.price || 0;
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  try {
    const paymentResponse = await instance.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    });

    return res.status(200).json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({ success: false, message: "Could not initiate Order" });
  }
};

export const enrollStudents = async (courses, userId) => {
  if (!courses || !userId) {
    throw new Error("Please provide data for courses and userId");
  }

  for (const courseId of courses) {
    // Add student to course
    const enrolledCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $addToSet: { studentEnrolled: userId } },
      { new: true }
    );

    if (!enrolledCourse) {
      throw new Error(`Course ${courseId} not found`);
    }

    // Initialize course progress if not existing
    let courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        courseId: courseId,
        userId: userId,
        completedVideos: [],
      });
    }

    // Add course and courseProgress to user
    const enrolledStudent = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          courses: courseId,
          courseProgress: courseProgress._id,
        },
      },
      { new: true }
    );

    // Send confirmation email
    try {
      if (enrolledStudent?.email) {
        await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        );
      }
    } catch (mailErr) {
      console.error("Failed to send course enrollment email:", mailErr);
    }
  }
};

export const verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Payment Verification Failed: Missing required fields",
    });
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Payment Verification Failed: Invalid Signature",
    });
  }

  try {
    await enrollStudents(courses, userId);
    return res.status(200).json({
      success: true,
      message: "Payment Verified and Enrolled",
    });
  } catch (error) {
    console.error("Enrollment error after payment:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to complete enrollment",
    });
  }
};

export const SendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({ success: false, message: "Please provide all the fields" });
  }

  try {
    const enrolledStudent = await User.findById(userId);
    if (!enrolledStudent) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await mailSender(
      enrolledStudent.email,
      "Payment Received Successfully",
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );

    return res.status(200).json({
      success: true,
      message: "Payment confirmation email sent",
    });
  } catch (error) {
    console.error("Error in sending payment success email:", error);
    return res.status(500).json({ success: false, message: "Could not send email" });
  }
};
