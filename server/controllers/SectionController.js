import Section from "../models/SectionModel.js";
import Course from "../models/CourseModel.js"
import SubSection from "../models/SubSectionModel.js";

// create section 

export const createSection = async (req,res) => {
    try {

        // data fetch 
        const {sectionName,courseId} = req.body;
        // data validate 
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing properties ",
            })
        }
        // create section 
        const newSection = await Section.create({sectionName});
        // update course with section ObjectId 
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id
                }
            },{
                new:true
            }
        )
 // HW: use populate to replace section / sub-section both in the updatedCourseDetails
        // return response 
        return res.status(200).json({
            success:true,
            message:"Session created successfully",
            updatedCourseDetails,
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create section please try again",
            error:error.message
        })
    }
}

// update section 
export const updateSection  = async (req,res) => {
    try {
        // data input 
        const {sectionName,sectionId} = req.body;
        // data validation 
        if(!sectionName || !sectionId) {
             return res.status(400).json({
                success:false,
                message:"Missing properties ",
            })
        }

        // update data 
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        // return res
        return res.status(200).json({
            success:true,
            message:"Section Updated successfully"
        })

    } catch (error) {
           return res.status(500).json({
            success:false,
            message:"Unable to update section please try again",
            error:error.message
        })
    }
}

// delete Section
export const deleteSection = async (req,res) => {
    try {
        // Fetch sectionId and courseId
        const {sectionId,courseId} = req.body;

        if(!sectionId || !courseId){
            return res.status(400).json({
                success:false,
                message:"SectionId and CourseId are required"
            })
        }

             const section = await Section.findById(sectionId);

             if(!section){
                return res.status(404).json({
                    success:false,
                    message:"Section not found"
                })
             }

             // if subSection exist , delte them
             if(section.subSection && section.subSection.length > 0){
                await SubSection.deleteMany({
                    _id:{ $in: section.subSection},
                })
             }

        // Remove Section Referece from Course
        await Course.findByIdAndUpdate(courseId,{
            $pull: {courseContent:sectionId}
        });

        // Delete the Section 
        await Section.findByIdAndDelete(sectionId);
 

        // Return Response
        return res.status(200).json({
            success:true,
            message:"Section deleted Successfully"
        })

    } catch (error) {
        
        console.error("Delete Section Error : ",error);

        return res.status(500).json({
            success:false,
            message:"Unable to delete Section",
            error:error.message
        })
    }
}