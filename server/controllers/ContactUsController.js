import  contactUsEmail  from "../mail/templates/contactFormRes.js"
import mailSender from "../utils/mailSender.js"

export const contactUsController = async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    firstname,
    lastname,
    message,
    phoneNo,
    countryCode,
    countrycode,
  } = req.body;

  const normalizedFirstName = firstName || firstname;
  const normalizedLastName = lastName || lastname;
  const normalizedCountryCode = countryCode || countrycode;

  try {
    await mailSender(
      email,
      "Your data send Successfully",
      contactUsEmail(
        email,
        normalizedFirstName,
        normalizedLastName,
        message,
        phoneNo,
        normalizedCountryCode
      )
    )

    return res.status(200).json({
      success: true,
      message: "Contact form submitted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error in contact ",
    })
  }
}
