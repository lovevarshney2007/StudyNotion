import {contactUsEmail} from "../mail/templates/contactFormRes.js"
import mailSender from "../utils/mailSender.js"

export const contactUsController = async (req,res) => {
    const {email,firstName,lastName,message,phoneNo} = req.body;

    console.log(req.body);
    try {
        await mailSender(
            email,
            "Your data send Successfully",
            contactUsEmail(email,firstName,lastName,message,phoneNo,countryCode)
        )
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"Server error in contact "
        })
    }
}