import React from 'react'
import { Link } from 'react-router-dom'
import Footer from '../component/common/Footer'

const sections = [
  {
    title: "Getting Started",
    items: ["Creating an account", "Browsing courses", "How to enroll", "Payment options"],
  },
  {
    title: "Account & Profile",
    items: ["Edit your profile", "Change password", "Upload profile picture", "Delete account"],
  },
  {
    title: "Learning",
    items: ["Accessing enrolled courses", "Tracking progress", "Course completion certificate", "Contacting instructors"],
  },
  {
    title: "Instructors",
    items: ["Become an instructor", "Creating a course", "Publishing your course", "Managing earnings"],
  },
]

function HelpCenterPage() {
  return (
    <div className='bg-richblack-900 text-white min-h-screen'>
      {/* Hero */}
      <div className='bg-richblack-800 py-16 text-center'>
        <h1 className='text-4xl font-bold text-richblack-5 mb-3'>Help Center</h1>
        <p className='text-richblack-300 text-lg max-w-xl mx-auto'>
          Find answers to common questions and learn how to get the most out of StudyNotion.
        </p>
        <Link to='/contact'>
          <button className='mt-6 rounded-lg bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 hover:bg-yellow-25 transition-colors duration-200'>
            Contact Support
          </button>
        </Link>
      </div>

      {/* FAQs / sections */}
      <div className='mx-auto w-11/12 max-w-maxContent py-16 grid grid-cols-1 md:grid-cols-2 gap-8'>
        {sections.map((section, i) => (
          <div key={i} className='rounded-xl border border-richblack-700 bg-richblack-800 p-6'>
            <h2 className='text-xl font-semibold text-richblack-5 mb-4'>{section.title}</h2>
            <ul className='flex flex-col gap-3'>
              {section.items.map((item, j) => (
                <li key={j} className='flex items-center gap-2 text-richblack-300 hover:text-richblack-5 cursor-pointer transition-colors duration-150'>
                  <span className='text-yellow-50'>›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}

export default HelpCenterPage
