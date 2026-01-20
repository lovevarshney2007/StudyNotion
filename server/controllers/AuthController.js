import bcrypt from "bcrypt";
import User from "../models/UserModel.js";
import OTP from "../models/OTPModel.js";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import mailSender from "../utils/mailSender.js";
import { passwordUpdated } from "../mail/templates/passwordUpdate.js";
import Profile from "../models/ProfileModel.js";
import dotenv from "dotenv"


dotenv.config();


// SendOtp
export const sendOTP = async (req, res) => {
  try {
    // fetch email from request ki body
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    //check if user already exist
    const checkUserPresent = await User.findOne({ email });

    // if user already exist , then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        succss: false,
        message: "User already registered",
      });
    }

    // generate Otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // check unique otp or not
    const result = await OTP.findOne({ otp: otp });
    console.log("Result is Generate OTP Func");
    console.log("OTP", otp);
    console.log("Result", result);

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    // create otp payload and save to database
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);

    console.log("OTP generated:", otp);
    console.log("OTP saved to DB:", otpBody);

    // Sending otp via email
    try {
      await mailSender(
        email,
        "Verification Otp",
        `your otp for Verification is : ${otp}. This otp will expire in 10 minutes`
      );

      res.status(200).json({
        success: true,
        message: `Otp sent successfully to ${email}`,
        // Don't send OTP in response in production
        // otp, // Remove this in production
      });
    } catch (error) {
      console.error("Error sending email: ", error);
      // Delete the otp if email failes to send
      await OTP.findByIdAndDelete(otpBody._id);
      return res.status(500).json({
        success: false,
        message: `Failed to send OTP email. Please try again.`,
        error: error.message,
      });
    }
  } catch (error) {
    console.log("Error while sending otp : ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// SIGNUP controller for registration Users

export const signUp = async (req, res) => {
  try {
    // Destructure fields from the req body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validate data

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp ||
      !contactNumber
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2 password verify (password and confirm Password verify or not)
    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirmPassword does not match , please try again ",
      });
    }
    // check if user exit or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered. Please sign in to continue",
      });
    }

    // find most recent otp stored for user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    // validate otp
    if (recentOtp.length == 0) {
      // otp not found
      return res.status(400).json({
        success: false,
        message: "Otp not found",
      });
    } else if (otp !== recentOtp[0].otp) {
      // invalid otp
      return res.status(400).json({
        success: false,
        message: "Incorrect otp",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create the user
    let approved = "";
    accountType === "Instructor" ? (approved = false) : (approved = true);

    // Create the additional profile for user

    const profileDetails = await Profile.create({
      gender: null,
      dateofBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}${lastName}
 `,
    });
    // return res
    return res.status(200).json({
      success: true,
      message: "User is registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered.Please try again",
    });
  }
};



// login
export const login = async (req, res) => {
  try {
    // get data from req body
    const { email, password } = req.body;
    // validation data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required , please try again ",
      });
    }
    // user check exit or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered,please signup first",
      });
    }
    // generate JWT , after password matching
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      // save token to user docuemnt in database
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      // create cookie and send response
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failiure,please try again ",
    });
  }
};

// changepassword

export const changePassword = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    // Get User Data from req.user
    const userDetails = await User.findById(req.user.id);
    console.log("REQ BODY:", req.body);


    // validate
    if (!userDetails) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Get oldPassword and newPassword
    const { oldPassword, newPassword } = req.body;
    // Validate old Password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );

    if (!isPasswordMatch) {
      // if old password does not match
      return res.status(401).json({
        success: false,
        message: "The password is incorrect",
      });
    }

    // update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // send Notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account is updated successfully",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
    } catch (error) {
      console.log("Error occured while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // return response
    return res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};
