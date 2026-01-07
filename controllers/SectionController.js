import Section from "../models/SectionModel";
import Course from "../models/CourseModel"

// create section 

exports.createSection = async (req,res) => {
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
exports.updateSection  = async (req,res) => {
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

// delete section 
exports.deteleSection = async (req,res) => {
    try {
        // get ID -> assuming that we are sending id in params   
        const {sectionId} = req.params
 
        // findByidANddeleteSection
        await Section.findByIdAndDelete(sectionId);

        // TODO:(Testing) do we need to delete entry from the course Schema ?? 

        // return response
        return res.status(200).json({
            success:true,
            message:"Section deleted Successfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update section please try again",
            error:error.message
        })
    }
}