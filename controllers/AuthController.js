import User from "../models/UserModel";
import OTP from "../models/OTPModel";
import otpGenerator from "otp-generator";
import { Profile } from "react";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// SendOtp
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from request ki body
    const { email } = req.body;

    //check if user already exist
    const checkUserPresent = await User.findOne({ email });

    // if user already exist , then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        succss: false,
        message: "User already registered",
      });
      console.log("Otp generated: ", otp);
    }

    // MUST BE CHANGE OTP METHOD

    // generate Otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // check unique otp or not
    const result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    // create an entry for otp
    const otpBody = await OTP.create(otpPayload);

    // return response successfully
    res.status(200).json({
      success: true,
      message: "OTP sent sucessfully",
      otp,
    });
  } catch (error) {
    console.log("Error while sending otp : ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// signup

exports.signUp = async (res, req) => {
  try {
    // data fetching from body
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
      email ||
      password ||
      !confirmPassword ||
      otp ||
      contactNumber
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2 password verify
    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirmPassword does not match , please try again ",
      });
    }
    // check user exit or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
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
    } else if (otp !== recentOtp.otp) {
      // invalid otp
      return res.status(400).json({
        success: false,
        message: "Incorrect otp",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // entry create entry in db

    const profileDetail = await Profile.create({
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
      additionalDetails: profileDetail._id,
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
exports.login = async (res, req) => {
  try {
    // get data from req body
    const { email, password } = req.body;
    // validation data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required , please tru again ",
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
        expiresIn: "2h",
      });

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

    }
    else {
        return res.status(401).json({
            success:false,
            message:"Password is incorrect",
        })
    }

    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Login Failiure,please try again "
    })
  }
};

// changepassword
// TODO
exports.changePassword = async(res,req) => {
    try {
      // get data from req body 
      const {email,oldPassword,newPassword,confirmNewPassword} = req.body;
  
      // validation
      if(!oldPassword || !newPassword || !confirmNewPassword){
        return res.status(400).json({
          success:false,
          message:"All fields are required",
        });
      }
  
      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({
          success: false,
          message: "New password and confirm password do not match",
        });
      }
      // update password in db 
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        user.password
      );
  
      
      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: "Old password is incorrect",
        });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
       user.password = hashedPassword;
      await user.save();
  
  
      // send email - password updates 
  
       await mailSender(
        user.email,
        "Password Changed Successfully",
        "Your password has been updated. If this wasn’t you, contact support immediately."
      );
  
      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
  
  
    } catch (error) {
        console.error("chnage password error : ",error);
    return res.status(500).json({
      success: false,
      message: "Eroor occuring while changing password",
    });
    }
    // return response
}