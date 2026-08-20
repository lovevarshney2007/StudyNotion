import SubSection from "../models/SubSectionModel.js";
import Section from "../models/SectionModel.js";
import uploadImageToCloudinary from "../utils/imageUploader.js";

// create SubSection
export const createSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body;
    const video = req.files?.video;

    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration || timeDuration || "0"}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: SubSectionDetails._id,
        },
      },
      { new: true }
    ).populate("subSection");

    return res.status(200).json({
      success: true,
      message: "Lecture Created Successfully",
      data: updatedSection,
      updatedSection,
    });
  } catch (error) {
    console.error("Create SubSection Error : ", error);
    return res.status(500).json({
      success: false,
      message: "Error during creating Subsection",
      error: error.message,
    });
  }
};

// Update Subsection 
export const updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }
    if (description !== undefined) {
      subSection.description = description;
    }
    if (req.files && req.files.video) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration || "0"}`;
    }

    await subSection.save();

    const updatedSection = await Section.findById(sectionId).populate("subSection");

    return res.status(200).json({
      success: true,
      message: "SubSection Updated Successfully",
      data: updatedSection,
      updatedSection,
    });
  } catch (error) {
    console.error("Update SubSection Error : ", error);
    return res.status(500).json({
      success: false,
      message: "Error in updating sub section",
      error: error.message,
    });
  }
};

// Delete Subsection 
export const deleteSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId } = req.body;

    await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: {
          subSection: subSectionId,
        },
      },
      { new: true }
    );

    const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);
    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found",
      });
    }

    const updatedSection = await Section.findById(sectionId).populate("subSection");

    return res.status(200).json({
      success: true,
      message: "Subsection deleted Successfully",
      data: updatedSection,
      updatedSection,
    });
  } catch (error) {
    console.error("Delete SubSection Error : ", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting Subsection",
      error: error.message,
    });
  }
};