import mongoose from "mongoose";
import { instance } from "../config/RazorPay.js";
import Course from "../models/CourseModel.js";
import User from "../models/UserModel.js";
import mailSender from "../utils/mailSender.js";
import { courseEntrollmentEmail } from "../mail/templates/courseEntrollmentEmail.js";
import {paymentSuccessEmail} from "../mail/templates/passwordSuccessEmail.js"
import webhooks from "razorpay/dist/types/webhooks";

// capture the payment and initiate the razorPay order
export const capturePayment = async (req, res) => {
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

export const verifySignature = async (req,res) => {
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
            );

            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:"Signature verified and course added",
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


// send Successfull mail of payment status
export const sendPaymentSuccessEmail = async (req,res) => {
  try {
    const {orderId,paymentId,amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId){
      return res.status(400).json({
        success:false,
        message:"Please provide all  the details"
      })
    }
    
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `payment received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName} `,
        amount /100,
        orderId,
        paymentId
      )
    );

  } catch (error) {
    console.log("Error in sending mail",error);
    return res.status(400).json({
      success:false,
      message:"Could not send email"
    })
  }
}


// Enroll student in course
 const  enrollStudent = async (courses,userId,res) => {
  // validation 
  if(!courses || !userId){
    return res.status(400).json({
      success:false,
      message:"Please Provide course id and userId"
    });
  }

  // Loop throught all courseIds
  for(const courseId of courses){
    try {
      
      // add userId to studentEnrolled array of courses 
     const enrolledCourse = await Course.findOneAndUpdate(
      {_id:courseId},
      {$push:{studentEnrolled:userId}},
      {new:true}
     );

     // if course not found 
     if(!enrolledCourse){
      return res.status(500).json({
        success:false,
        message:"Course not found"
      });
     }

     console.log("Updated course : ",enrolledCourse);

     // CreateingcourseProgress entry for this user & courser
     // This will track which video user has completed 
     const courseProgress = await courseProgress.create({
      courseId:courseId,
      userId:userId,
      completedVideos:[]
     });

     // addCourseId and courseProgressId to user schema 
     const enrolledStudent = await User.findByIdAndUpdate(
      userId,
      {
        $push:{
          courses:courseId,
          courseProgress:courseProgress._id,
        }
      },
      {new:true}
     )

     console.log("enrolled Student : ",enrolledStudent);

     //Send Confirmation Mail to student
     const emailResponse = await mailSender(
      enrolledStudent.email,
      `Successfully Enrolled into ${enrolledCourse.courseName}`,
     )
     courseEntrollmentEmail(
      enrolledCourse.courseName,
      `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
     )

     console.log("Email sent successfully: ", emailResponse.response);


    } catch (error) {
       console.log(error);
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}