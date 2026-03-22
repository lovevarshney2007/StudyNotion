import React from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineEmojiSad } from 'react-icons/hi'

const Error = () => {
  return (
    <div className='min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center gap-6 bg-richblack-900 text-white px-4 text-center'>
      {/* 404 icon / number */}
      <div className='flex items-center gap-4'>
        <HiOutlineEmojiSad className='text-8xl text-yellow-50' />
        <span className='text-[120px] font-bold leading-none text-richblack-700 select-none'>
          404
        </span>
      </div>

      {/* Message */}
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold text-richblack-5'>
          Page Not Found
        </h1>
        <p className='text-richblack-300 max-w-md text-base'>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 flex-wrap justify-center mt-2'>
        <Link to='/'>
          <button className='rounded-lg bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 hover:bg-yellow-25 transition-colors duration-200'>
            Go to Home
          </button>
        </Link>
        <Link to='/catalog'>
          <button className='rounded-lg border border-richblack-600 bg-richblack-800 px-6 py-3 font-semibold text-richblack-100 hover:bg-richblack-700 transition-colors duration-200'>
            Browse Courses
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Error