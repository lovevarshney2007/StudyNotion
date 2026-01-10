import User from "../models/UserModel";
import mailSender from "../utils/mailSender";
import bcrypt from "bcrypt";

// resetPasswordToken

export const resetPasswordToken = async (req, res) => {
  try {
    // get email from req body
    const email = req.body.email;
    // check user for this , email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: "Your email is not registered with Us",
      });
    }
    // generate Token
    const token = crypto.randomUUID();

    // update user by adding token and expireation time
    const updateDetails = await User.findOneAndUpdate(
      {
        email: email,
      },
      {
        token: token,
        resetPasswordExpire: Date.now() + 5 * 60 * 60 * 1000,
      },
      { new: true }
    );
    // create url
    const url = `http://localhost:3000/update-password/${token}`;
    // send mail containing the url
    await mailSender(
      email,
      "password reset Link",
      `Password Reset Link: ${url}`
    );
    // return response
    return res.json({
      success: true,
      message:
        "Email sent successfully , please check email and change your password",
    });
  } catch (error) {
    console.log("Error occured while sending reset password link : ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reset Password mail",
    });
  }
};

// resetPassword
export const resetPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;
    // validation
    if (password != confirmPassword) {
      return res.json({
        success: false,
        message: "password is not matching",
      });
    }
    // get Userdetails from db using token
    const userDetails = await User.findOne({ token: token });

    // if no entry -> invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is invalid",
      });
    }
    // token time check
    if (userDetails.resetPasswordExpire > Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired,please regenerate your token",
      });
    }

    // password hash
    const hashedPassword = await bcrypt.hash(password, 10);
    // passwordUpdate
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Error occured in reset and updateing passoword : ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reset Password mail",
    });
  }
};
