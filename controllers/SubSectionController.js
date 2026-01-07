import SubSection from "../models/SubSectionModel"
import Section from "../models/SectionModel"
import uploadImageToCloudinary from "../utils/imageUploader"

// cretae SubSection 

exports.createSubSection = async (req, res ) => {
    try {
        // data fetch from req.body
        const {sectionId,title,timeDuration,description} = req.body
        // extract file/video
        const video = req.files.videoFile;
        // data validation
        if(!sectionId || !title || !timeDuration || !description){
            return res.status(400).json({
                success:false,
                messgae:"ALL fields are required"
            })
        }
        // uploadToCloudinary or folder
        const uploadDetails = await uploadImageToCloudinary(video,proccess.env.FOLDER_NAME)
        // create a sub-section 
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url
        })
        // update section with this subsection ObjectId
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},{
            $push:{
                SubSection:SubSectionDetails._id
            }
        },{new:true})

        // Hw: log updated Section here, after adding populate query

        // return response
        return res.status(200).json({
            success:true,
            message:"subsection Created Successfully",
            updatedSection,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error during create SUbsection"
        })
    }
}