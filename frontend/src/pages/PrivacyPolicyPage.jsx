import React from 'react'
import Footer from '../component/common/Footer'

function PrivacyPolicyPage() {
  return (
    <div className='bg-richblack-900 text-white min-h-screen'>
      {/* Hero */}
      <div className='bg-richblack-800 py-16 text-center'>
        <h1 className='text-4xl font-bold text-richblack-5 mb-3'>Privacy Policy</h1>
        <p className='text-richblack-400 text-sm'>Last updated: March 2026</p>
      </div>

      <div className='mx-auto w-11/12 max-w-[860px] py-16 flex flex-col gap-10 text-richblack-100 leading-7'>
        {[
          {
            heading: "1. Information We Collect",
            body: "We collect information you provide directly to us, such as when you create an account, enroll in a course, or contact us for support. This includes your name, email address, payment information, and any content you submit on the platform.",
          },
          {
            heading: "2. How We Use Your Information",
            body: "We use the information we collect to provide, maintain, and improve our services, process transactions, communicate with you, and personalize your learning experience. We do not sell your personal information to third parties.",
          },
          {
            heading: "3. Cookies",
            body: "We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies help us improve your experience, understand how our services are used, and personalize content.",
          },
          {
            heading: "4. Data Security",
            body: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.",
          },
          {
            heading: "5. Third-Party Services",
            body: "We may use third-party services such as payment processors, analytics providers, and cloud storage. These third parties have their own privacy policies and we encourage you to review them.",
          },
          {
            heading: "6. Your Rights",
            body: "You have the right to access, update, or delete your personal information at any time through your account settings. For further assistance, please contact us at privacy@studynotion.com.",
          },
          {
            heading: "7. Changes to This Policy",
            body: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the 'Last updated' date.",
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

export default PrivacyPolicyPage
