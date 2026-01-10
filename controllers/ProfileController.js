import ProfileModel from "../models/ProfileModel";
import User from "../models/UserModel";

export const updatePofile = async (req, res) => {
  try {
    // get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    // get Userid
    const id = req.user.id;
    // validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await ProfileModel.findById(profileId);

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    // return response
    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in profileController",
      error: error.message,
    });
  }
};

// delete Account
// Explore -> how can we schedule this deletion user

export const deleteAccount = async (req, res) => {
  try {
    // get id
    const id = req.user.id;

    // validation
    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    // delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    // todo: hw uneroll user from all enrolled courses

    // delete user
    await User.findByIdAndDelete({ _id: id });

    // return res
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
        success:false,
        message:"Internal Server Error while deleteing account "
    })
  }
};

// crown jop

export const getAllUserDetails = async(req,res) => {
    try {
        // get id 
        const {id} = req.user.id

        // validation and user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        // return res
        return res.status(200).json({
            success:true,
            message:"User Data Fetched Successfully",
        })

    } catch (error) {
         return res.status(500).json({
        success:false,
        message:error.message
    })
    }
}