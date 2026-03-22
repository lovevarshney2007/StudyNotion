import React, { useRef } from 'react'
import { RxCross2 } from "react-icons/rx"
import { useSelector } from 'react-redux'
import logo from "../../../Asset/Logo/Logo-Full-Dark.png"

export default function CertificateModal({ course, setCertificateModal }) {
  const { user } = useSelector((state) => state.profile)
  const certificateRef = useRef(null)

  const handleDownload = () => {
    // Basic browser print functionality for saving as PDF
    window.print()
  }

  // Format date to locale string
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm print:bg-white print:static print:h-auto print:w-auto">
      
      {/* Container to handle close action easily outside print */}
      <div className="my-10 w-11/12 max-w-[800px] flex flex-col items-end gap-3 print:m-0 print:w-full print:max-w-none">
        
        {/* Controls (Hidden during print) */}
        <div className="flex gap-4 print:hidden w-full justify-end">
          <button 
            onClick={handleDownload}
            className="rounded-md bg-yellow-50 px-4 py-2 font-semibold text-richblack-900 transition-colors hover:bg-yellow-25"
          >
            Download PDF
          </button>
          <button 
            onClick={() => setCertificateModal(null)}
            className="rounded-md bg-richblack-700 px-3 py-2 text-richblack-5 transition-colors hover:bg-richblack-600"
          >
            <RxCross2 className="text-xl" />
          </button>
        </div>

        {/* The Certificate Itself */}
        <div 
          ref={certificateRef}
          className="relative w-full aspect-[1.414/1] bg-white border-[16px] border-richblack-800 p-12 flex flex-col items-center text-center font-sans
                     print:border-[8px] print:shadow-none shadow-2xl"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff, #f0f4f8)' }}
        >
          {/* Certificate Border Details */}
          <div className="absolute inset-4 border-2 border-dashed border-richblack-300 pointer-events-none"></div>

          {/* Logo */}
          <div className="mb-8 mt-4">
            <img src={logo} alt="StudyNotion Logo" className="h-[40px] opacity-90" />
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-richblack-900 tracking-wide uppercase mb-2">
            Certificate of Completion
          </h1>
          <p className="text-lg text-richblack-500 uppercase tracking-widest mb-10">
            This is to certify that
          </p>

          <h2 className="text-5xl md:text-6xl font-script text-yellow-500 font-bold mb-6 italic" style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive" }}>
            {user?.firstName} {user?.lastName}
          </h2>

          <p className="text-lg text-richblack-600 max-w-[80%] mx-auto mb-6 leading-relaxed">
            has successfully completed the online course
          </p>

          <h3 className="text-3xl font-bold text-richblack-800 mb-12">
            {course?.courseName}
          </h3>

          {/* Signatures & Dates */}
          <div className="w-full mt-auto flex justify-between px-10 items-end">
            <div className="flex flex-col items-center">
              <div className="w-40 border-b border-richblack-900 mb-2 pb-1 text-xl font-script text-richblack-800 italic">
                {today}
              </div>
              <p className="text-sm font-semibold uppercase tracking-wider text-richblack-500">Date</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-40 border-b border-richblack-900 mb-2 pb-1 text-xl font-script text-richblack-800 italic" style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive" }}>
                StudyNotion Admin
              </div>
              <p className="text-sm font-semibold uppercase tracking-wider text-richblack-500">Instructor</p>
            </div>
          </div>
          
        </div>

      </div>
      
      {/* Global CSS overrides for printing only this element */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed > div:last-child, .fixed > div:last-child * {
            visibility: visible;
          }
          .fixed > div:last-child {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  )
}
