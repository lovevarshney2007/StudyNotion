import User from "../models/UserModel.js";
import mailSender from "../utils/mailSender.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

// resetPasswordToken
export const resetPasswordToken = async (req, res) => {
  try {
    // get email from req body
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // check user for this , email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Your email is not registered with Us",
      });
    }
    // generate Token
    const token = crypto.randomUUID();

    // update user by adding token and expiration time (5 minutes)
    await User.findOneAndUpdate(
      {
        email: email,
      },
      {
        token: token,
        resetPasswordExpire: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    // create url
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const url = `${frontendUrl}/update-password/${token}`;

    // send mail containing the url
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link: ${url}`
    );

    // return response
    return res.status(200).json({
      success: true,
      message:
        "Email sent successfully, please check your email and change your password",
    });
  } catch (error) {
    console.error("Error occurred while sending reset password link : ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset password email",
    });
  }
};

// resetPassword
export const resetPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;
    // validation
    if (!password || !confirmPassword || !token) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }
    // get Userdetails from db using token
    const userDetails = await User.findOne({ token: token });

    // if no entry -> invalid token
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid",
      });
    }
    // token time check
    if (userDetails.resetPasswordExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token has expired, please regenerate your token",
      });
    }

    // password hash
    const hashedPassword = await bcrypt.hash(password, 10);
    // passwordUpdate
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword, token: null, resetPasswordExpire: null },
      { new: true }
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error occurred in resetting password : ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting password",
    });
  }
};
