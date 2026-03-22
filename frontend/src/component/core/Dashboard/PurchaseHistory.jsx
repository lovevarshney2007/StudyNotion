import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/ProfileAPi'
import { useNavigate } from 'react-router-dom'

export default function PurchaseHistory() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [history, setHistory] = useState(null)

  useEffect(() => {
    // In a real app we'd fetch a dedicated /payment/history endpoint.
    // Here we'll map enrolled courses as our past purchases.
    const getHistory = async () => {
      try {
        const res = await getUserEnrolledCourses(token)
        setHistory(res)
      } catch (error) {
        console.log("Could not fetch purchase history.")
      }
    }
    getHistory()
  }, [token])

  return (
    <>
      <div className="text-3xl text-richblack-50 mb-14">Purchase History</div>
      
      {!history ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : history.length === 0 ? (
        <p className="grid h-[20vh] w-full place-content-center text-richblack-5">
          You have not purchased any courses yet.
        </p>
      ) : (
        <div className="rounded-md border border-richblack-700 bg-richblack-800 text-richblack-5">
          <div className="flex rounded-t-lg bg-richblack-500 font-semibold px-6 py-4">
            <p className="flex-1">Course</p>
            <p className="w-[120px]">Price</p>
            <p className="w-[120px]">Status</p>
            <p className="w-[150px]">Action</p>
          </div>
          
          <div className="flex flex-col">
            {history.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center px-6 py-4 border-t border-richblack-700 ${index === history.length - 1 ? 'rounded-b-md' : ''}`}
              >
                <div className="flex flex-1 items-center gap-4">
                  <img 
                    src={item.thumbnail} 
                    alt="course"
                    className="h-12 w-12 rounded-lg object-cover" 
                  />
                  <p className="font-medium text-richblack-50">{item.courseName}</p>
                </div>
                {/* Fallback price since EnrolledCourses doesn't return price by default */}
                <p className="w-[120px] text-richblack-300">₹{item.price || 4999}</p> 
                <p className="w-[120px]">
                  <span className="rounded-full bg-caribbeangreen-100/10 px-3 py-1 text-xs font-semibold text-caribbeangreen-200">
                    Paid
                  </span>
                </p>
                <div className="w-[150px]">
                  <button 
                    onClick={() => navigate(`/view-course/${item._id}/section/${item.courseContent?.[0]?._id}/sub-section/${item.courseContent?.[0]?.subSection?.[0]?._id}`)}
                    className="text-yellow-50 hover:underline text-sm font-medium"
                  >
                    View Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
