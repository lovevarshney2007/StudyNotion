import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiConnector } from '../services/apiConnector'
import { courseEndpoints } from '../services/apis'
import Course_Card from '../component/core/Catalog/Course_Card'
import Footer from '../component/common/Footer'

const SearchResults = () => {
  const { searchQuery } = useParams()
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", courseEndpoints.GET_ALL_COURSE_API)
        if (res?.data?.data) {
          // Client-side filtering for search query
          const searchTerm = searchQuery.toLowerCase()
          const filtered = res.data.data.filter(course => 
            course.courseName.toLowerCase().includes(searchTerm) || 
            course.courseDescription.toLowerCase().includes(searchTerm)
          )
          setCourses(filtered)
        }
      } catch (error) {
        console.log("Error fetching courses for search", error)
      } finally {
        setLoading(false)
      }
    }

    if (searchQuery) {
      fetchCourses()
    }
  }, [searchQuery])

  return (
    <>
      <div className="box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
          <p className="text-sm text-richblack-300">
            <Link to="/">Home</Link> / Search Results
          </p>
          <p className="text-3xl text-richblack-5">
            Search Results for <span className="text-yellow-50">"{searchQuery}"</span>
          </p>
          <p className="max-w-[870px] text-richblack-200">
            Found {courses.length} {courses.length === 1 ? 'course' : 'courses'} matching your search.
          </p>
        </div>
      </div>

      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        {loading ? (
          <div className="grid min-h-[200px] place-items-center">
            <div className="spinner"></div>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {courses.map((course, index) => (
              <Course_Card course={course} key={index} Height={"h-[250px]"} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center text-richblack-5">
            <p className="text-2xl font-semibold">No courses found</p>
            <p className="text-richblack-300">Try adjusting your search terms or browse our catalog.</p>
            <Link to="/catalog/web-development">
              <button className="mt-4 rounded-md bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 transition-colors hover:bg-yellow-25">
                Browse Catalog
              </button>
            </Link>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  )
}

export default SearchResults
