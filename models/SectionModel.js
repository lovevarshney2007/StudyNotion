import mongoose, { mongo, Mongoose } from "mongoose";

const SectionSchema = new mongoose.Schema({
    sectionName:{
        type:String,
    },
    subSection: [{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"Subscription",
    }],
   
})

module.exports = mongoose.model("Section",SectionSchema)