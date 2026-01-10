import { instance } from "../config/RazorPay";
import Course from "../models/CourseModel";
import User from "../models/UserModel";
import mailSender from "../utils/mailSender";
import { courseEntrollmentEmail } from "../mail/templates/courseEntrollmentEmail";
import mongoose from "mongoose";
import webhooks from "razorpay/dist/types/webhooks";

// capture the payment and initiate the razorPay order
exports.capturePayment = async (req, res) => {
  // get Userid and Course Id
  const { course_id } = req.body;
  const userId = req.user.id;
  // validation
  // valid CourseId
  if (!course_id) {
    return res.json({
      success: false,
      message: "Please provide valid course id",
    });
  }
  // valid CourseDetail
  let course;
  try {
    course = await Course.findById(course_id);
    if (!course) {
      return res.json({
        success: false,
        message: "Could not find the course",
      });
    }
    // user already pay for the same course of not

    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student is already enrolled",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  // order create
  const amount = course.price;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    raceipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: course_id,
      userId,
    },
  };

  try {
    // initiate the payment using razorPay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);

    // return response
    return res.status(200).json({
      success: true,
      message: "Course entrolled successfully",
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.courseThumbnail,
      orderid:paymentResponse.id,
      currency:paymentResponse.currency,
      amount:paymentResponse.amount,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Courld not initate order ",
    });
  }
};


// verify signature of razorPay

exports.verifySignature = async (req,res) => {
    const webhookSecret = "12345678";

    const signature = req.headers("x-razorpay-signature");

    const shasum = crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature===digest){
        console.log("Payment is authorised");

        const {courseId,userId} = req.body.payload.payment.entity.notes;

        try {
            // fulfill the action
            // find the course and enroll the student in it
            const enrolledCourse = await Course.findByIdAndUpdate(
                {_id:courseId},
                {$push:{studentEnrolled:userId}},
                {new:true}
            );
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found",
                })
            }

            console.log(enrolledCourse)

            // find the student and add course list  of enrolled courses me
            const enrolledStudent = await User.findOneAndUpdate(
                {_id:userId},
                {$push:{courses:courseId}},
                {new:true}
            )

            console.log(enrolledStudent);

            // mail send kardo confirmation bala

            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congratulation from Codehelp",
                "Congratulation ,you are onboared into new Codehelp course"
            )

            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:"Signature verified and course added",=
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }
    else {
        return res.status(400).json({
            success:false,
            message:"Invalid Request"
        })
    }


}
