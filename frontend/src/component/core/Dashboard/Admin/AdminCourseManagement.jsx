import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAllCoursesAdmin, deleteCourseAdmin } from '../../../../services/operations/adminAPI'
import { FiSearch, FiTrash2 } from 'react-icons/fi'

export default function AdminCourseManagement() {
  const { token } = useSelector((state) => state.auth)
  const [courses, setCourses] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    ;(async () => {
      const data = await getAllCoursesAdmin(token)
      setCourses(data)
      setFiltered(data)
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    let result = courses
    if (statusFilter !== 'All') result = result.filter((c) => c.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.courseName?.toLowerCase().includes(q) ||
          c.instructor?.firstName?.toLowerCase().includes(q) ||
          c.instructor?.lastName?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, statusFilter, courses])

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    setDeletingId(courseId)
    const res = await deleteCourseAdmin(token, courseId)
    if (res?.success) {
      setCourses((prev) => prev.filter((c) => c._id !== courseId))
    }
    setDeletingId(null)
  }

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="text-richblack-5">
      <h1 className="text-2xl font-bold mb-1">Course Management</h1>
      <p className="text-richblack-300 mb-6">{courses.length} courses on the platform</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-richblack-400" />
          <input
            type="text"
            placeholder="Search courses or instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-richblack-700 pl-10 pr-4 py-2 text-sm text-richblack-5 placeholder-richblack-400 outline-none focus:ring-1 focus:ring-yellow-50"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Published', 'Draft'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                statusFilter === s
                  ? 'bg-yellow-50 text-richblack-900'
                  : 'bg-richblack-700 text-richblack-200 hover:bg-richblack-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-richblack-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-richblack-700 text-richblack-200 uppercase text-xs tracking-wider">
                <th className="px-6 py-3 text-left">Course</th>
                <th className="px-6 py-3 text-left">Instructor</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Price</th>
                <th className="px-6 py-3 text-right">Students</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-richblack-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-richblack-400">
                    No courses found
                  </td>
                </tr>
              ) : (
                filtered.map((course) => (
                  <tr key={course._id} className="hover:bg-richblack-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail}
                          alt={course.courseName}
                          className="h-10 w-16 rounded object-cover flex-shrink-0"
                        />
                        <span className="font-medium text-richblack-5 max-w-[200px] truncate">
                          {course.courseName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-richblack-200">
                      {course.instructor
                        ? `${course.instructor.firstName} ${course.instructor.lastName}`
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          course.status === 'Published'
                            ? 'bg-green-900 text-green-300'
                            : 'bg-yellow-900 text-yellow-300'
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-richblack-200">
                      ₹{(course.price || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-richblack-200">
                      {course.studentEnrolled?.length || 0}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(course._id)}
                        disabled={deletingId === course._id}
                        className="flex items-center gap-1 rounded-lg bg-pink-900 px-3 py-1.5 text-xs font-semibold text-pink-300 hover:bg-pink-800 transition-colors disabled:opacity-50"
                      >
                        <FiTrash2 />
                        {deletingId === course._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
