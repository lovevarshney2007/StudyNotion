import mongoose from "mongoose";


const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    otp: {
        type:String,
        require:true
    },
    createdAt: {
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
});

// a function -> to send emails
async function sendVerificationEmail(email,otp) {
    try {
        const mailResponse = await mailSender(email,"Verification Email from StudyNotion",otp);
        console.log("Mail successfully delivered",mailResponse);
    } catch (error) {
        console.log("error occured while sending mail ",error);
        throw error;

    }
}

OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})

module.exports = mongoose.model("OTPSchema",OTPSchema)