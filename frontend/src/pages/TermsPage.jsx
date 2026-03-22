import React from 'react'
import Footer from '../component/common/Footer'

function TermsPage() {
  return (
    <div className='bg-richblack-900 text-white min-h-screen'>
      {/* Hero */}
      <div className='bg-richblack-800 py-16 text-center'>
        <h1 className='text-4xl font-bold text-richblack-5 mb-3'>Terms & Conditions</h1>
        <p className='text-richblack-400 text-sm'>Last updated: March 2026</p>
      </div>

      <div className='mx-auto w-11/12 max-w-[860px] py-16 flex flex-col gap-10 text-richblack-100 leading-7'>
        {[
          {
            heading: "1. Acceptance of Terms",
            body: "By accessing and using StudyNotion, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform.",
          },
          {
            heading: "2. User Accounts",
            body: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. You must be at least 13 years old to create an account.",
          },
          {
            heading: "3. Course Enrollment and Access",
            body: "Upon purchasing a course, you are granted a non-exclusive, non-transferable license to access and view the course content for personal, non-commercial purposes. Course access is lifetime unless stated otherwise.",
          },
          {
            heading: "4. Intellectual Property",
            body: "All content on StudyNotion, including courses, videos, and text, is owned by StudyNotion or its content providers and is protected by copyright. You may not reproduce, distribute, or create derivative works without written permission.",
          },
          {
            heading: "5. Prohibited Activities",
            body: "You agree not to share your account credentials, download course videos for redistribution, post harmful or offensive content, misrepresent yourself or others, or attempt to gain unauthorized access to any part of the platform.",
          },
          {
            heading: "6. Refund Policy",
            body: "We offer a 30-day money-back guarantee on courses if you are unsatisfied with your purchase. Refunds are processed to the original payment method within 5-10 business days.",
          },
          {
            heading: "7. Limitation of Liability",
            body: "StudyNotion shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our maximum liability shall not exceed the amount paid by you in the past 12 months.",
          },
          {
            heading: "8. Changes to Terms",
            body: "We reserve the right to modify these terms at any time. We will notify registered users of material changes. Continued use of the platform after changes constitutes acceptance of the new terms.",
          },
        ].map((section, i) => (
          <div key={i} className='flex flex-col gap-2'>
            <h2 className='text-xl font-semibold text-richblack-5'>{section.heading}</h2>
            <p>{section.body}</p>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}

export default TermsPage
