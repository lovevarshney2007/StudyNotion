import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    description:{
        type:String
    },
    course:{
        type:mongoose.Types.ObjectId,
        ref:"Course"
    },
})


const Category = mongoose.model("Category",categorySchema);
export default Category;