import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    gender:{
        type:String,
        enum:["Male","Female"],
        // required:true
    },
    dateOfBirth:{
        type:Date,
        // required:true,
    },
    contactNumber:{
        type:Number,
        // required:true,
        trim:true
    },
    about:{
        type:String,
    }

})

const Profile = mongoose.model("Profile",profileSchema)
export default Profile;