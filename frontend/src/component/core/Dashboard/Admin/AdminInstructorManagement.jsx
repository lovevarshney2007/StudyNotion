import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAllInstructors } from '../../../../services/operations/adminAPI'
import { FiSearch } from 'react-icons/fi'

export default function AdminInstructorManagement() {
  const { token } = useSelector((state) => state.auth)
  const [instructors, setInstructors] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    ;(async () => {
      const data = await getAllInstructors(token)
      setInstructors(data)
      setFiltered(data)
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    if (!search.trim()) { setFiltered(instructors); return }
    const q = search.toLowerCase()
    setFiltered(
      instructors.filter(
        (i) =>
          i.firstName?.toLowerCase().includes(q) ||
          i.lastName?.toLowerCase().includes(q) ||
          i.email?.toLowerCase().includes(q)
      )
    )
  }, [search, instructors])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="text-richblack-5">
      <h1 className="text-2xl font-bold mb-1">Instructor Management</h1>
      <p className="text-richblack-300 mb-6">{instructors.length} instructors on the platform</p>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-richblack-400" />
        <input
          type="text"
          placeholder="Search instructors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg bg-richblack-700 pl-10 pr-4 py-2 text-sm text-richblack-5 placeholder-richblack-400 outline-none focus:ring-1 focus:ring-yellow-50"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <p className="text-richblack-400 col-span-3 text-center py-10">No instructors found</p>
        ) : (
          filtered.map((instructor) => {
            const totalStudents = instructor.courses?.reduce(
              (sum, c) => sum + (c.studentEnrolled?.length || 0),
              0
            ) || 0
            const totalRevenue = instructor.courses?.reduce(
              (sum, c) => sum + (c.price || 0) * (c.studentEnrolled?.length || 0),
              0
            ) || 0

            return (
              <div
                key={instructor._id}
                className="rounded-xl bg-richblack-800 p-5 flex flex-col gap-4 hover:bg-richblack-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={instructor.image || `https://api.dicebear.com/7.x/initials/svg?seed=${instructor.firstName}`}
                    alt={instructor.firstName}
                    className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-richblack-5 truncate">
                      {instructor.firstName} {instructor.lastName}
                    </p>
                    <p className="text-xs text-richblack-300 truncate">{instructor.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'Courses', value: instructor.courses?.length || 0 },
                    { label: 'Students', value: totalStudents },
                    { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}` },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-richblack-900 p-2">
                      <p className="text-sm font-bold text-richblack-5">{stat.value}</p>
                      <p className="text-[10px] text-richblack-400 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {instructor.courses?.length > 0 && (
                  <div>
                    <p className="text-xs text-richblack-400 mb-2 uppercase tracking-wider">Courses</p>
                    <div className="flex flex-wrap gap-1">
                      {instructor.courses.slice(0, 3).map((c) => (
                        <span
                          key={c._id}
                          className="rounded-full bg-richblack-600 px-2 py-0.5 text-xs text-richblack-200"
                        >
                          {c.courseName?.slice(0, 20)}{c.courseName?.length > 20 ? '…' : ''}
                        </span>
                      ))}
                      {instructor.courses.length > 3 && (
                        <span className="rounded-full bg-richblack-600 px-2 py-0.5 text-xs text-richblack-400">
                          +{instructor.courses.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
