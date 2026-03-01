import React from 'react'
import Template from '../component/core/Auth/Template'
import signupImg from "../Asset/Image/signup.webp"

function SignupPage() {
  return (
    <Template
    title="Join the millions learning to code with StudyNotion for free"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={signupImg}
      formType="signup"
     />
  )
}

export default SignupPage