import SubSection from "../models/SubSectionModel.js";
import Section from "../models/SectionModel.js";
import uploadImageToCloudinary from "../utils/imageUploader.js";

// cretae SubSection

export const createSubSection = async (req, res) => {
  try {
    // data fetch from req.body
    const { sectionId, title, timeDuration, description } = req.body;
    // extract file/video
    const video = req.files.videoFile;
    // data validation
    if (!sectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        messgae: "ALL fields are required",
      });
    }
    // uploadToCloudinary or folder
    const uploadDetails = await uploadImageToCloudinary(
      video,
      proccess.env.FOLDER_NAME
    );
    // create a sub-section
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });
    // update section with this subsection ObjectId
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          SubSection: SubSectionDetails._id,
        },
      },
      { new: true }
    );

    // Hw: log updated Section here, after adding populate query

    // return response
    return res.status(200).json({
      success: true,
      message: "subsection Created Successfully",
      updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error during create SUbsection",
    });
  }
};

// Update Subsection 
export const updateSubSection = async (req,res) => {
  try {
    // Fetching data
    const {sectionId,subSectionId,title,description} = req.body;

    // Search Subsection 
    const subSection = await subSection.findById(subSectionId);

    if(!subSection){
      return res.status(404).json({
        success:false,
        message:"Subsection not found"
      });
    }

    // update title 
    if(title !== undefined){
      subSection.title = title;
    }
    // update description
    if(description !== undefined) {
      subSection.description = description
    }
    // If new Video comes
    if(req.files && req.files.video){
      
      const video = req.files.video;

      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );

      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    // save changes;
    await subSection.save();

    // Send Updated SubSection 
    const updatedSection = await Section.findById(sectionId).populate("subsection");

    // return response
    return res.status(200).json({
      success:true,
      message:"SubSection Updated Successfully"
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success:false,
      messaage:"Error in update sub section"
    })
  }
}

// Delete Subsection 
export const deleteSubSection = async (req,res) => {
 try {
  // fetch sectionId and Subsection Id
   const {sectionId,subSectionId} = req.body;

   // Remove Subsection from section 
   await Section.findByIdAndUpdate(
    sectionId,
    {
      $pull:{
        subSection:subSectionId
      }
    },
    {new:true}
   );

   // delete Subsection
   const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

   if(!deletedSubSection){
    return res.status(404).json({
      success:false,
      message:"Subsection is not found"
    })
   }

   // return Updated Section 
   const updatedSection = await Section.findById(sectionId).populate("subSection");

   // return response 
   return res.status(200).json({
    success:true,
    message:"Subsection deleted Successfully",
    data:updatedSection
   })
 
 } catch (error) {
  console.error(error);
  return res.status(500).json({
    success:false,
    message:"Error while deleting Subsection"
   })
 }
}