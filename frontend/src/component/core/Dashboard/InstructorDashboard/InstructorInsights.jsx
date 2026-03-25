import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchInstructorCourses } from '../../../../services/operations/CourseDetailsApi'
import { getInstructorData } from '../../../../services/operations/ProfileAPi'
import { Pie, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

export default function InstructorInsights() {
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState(null)
  const [courses, setCourses] = useState([])
  const [chartType, setChartType] = useState('students') // 'students' | 'revenue'

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const instructorApiData = await getInstructorData(token)
      const result = await fetchInstructorCourses(token)
      if (instructorApiData?.length) setInstructorData(instructorApiData)
      if (result) setCourses(result)
      setLoading(false)
    })()
  }, [])

  const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0) || 0
  const totalStudents = instructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0) || 0
  const totalCourses = courses.length

  const COLORS = [
    '#FFD60A', '#06D6A0', '#118AB2', '#EF476F', '#073B4C',
    '#8338EC', '#FB5607', '#3A86FF', '#FFBE0B', '#FF99C8',
  ]

  const pieData = {
    labels: instructorData?.map((c) => c.courseName) || [],
    datasets: [
      {
        data:
          chartType === 'students'
            ? instructorData?.map((c) => c.totalStudentsEnrolled) || []
            : instructorData?.map((c) => c.totalAmountGenerated) || [],
        backgroundColor: COLORS,
        borderColor: '#1E293B',
        borderWidth: 2,
      },
    ],
  }

  const barData = {
    labels: instructorData?.map((c) => c.courseName.slice(0, 18) + (c.courseName.length > 18 ? '…' : '')) || [],
    datasets: [
      {
        label: chartType === 'students' ? 'Students Enrolled' : 'Revenue (₹)',
        data:
          chartType === 'students'
            ? instructorData?.map((c) => c.totalStudentsEnrolled) || []
            : instructorData?.map((c) => c.totalAmountGenerated) || [],
        backgroundColor: '#FFD60A',
        borderColor: '#B7950B',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#E2E8F0' } },
      title: {
        display: true,
        text: chartType === 'students' ? 'Students per Course' : 'Revenue per Course (₹)',
        color: '#E2E8F0',
        font: { size: 14 },
      },
    },
    scales: {
      x: { ticks: { color: '#94A3B8' }, grid: { color: '#334155' } },
      y: { ticks: { color: '#94A3B8' }, grid: { color: '#334155' } },
    },
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
      <h1 className="text-2xl font-bold mb-1">Insights</h1>
      <p className="text-richblack-300 mb-6">Detailed metrics for all your courses</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Courses', value: totalCourses, color: 'from-yellow-400 to-yellow-600' },
          { label: 'Total Students', value: totalStudents, color: 'from-caribbeangreen-300 to-caribbeangreen-500' },
          { label: 'Total Revenue', value: `₹${totalAmount.toLocaleString()}`, color: 'from-blue-400 to-blue-600' },
        ].map((card) => (
          <div
            key={card.label}
            className={`rounded-xl bg-gradient-to-br ${card.color} p-px`}
          >
            <div className="rounded-xl bg-richblack-800 p-6 h-full">
              <p className="text-richblack-200 text-sm uppercase tracking-wider">{card.label}</p>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {!instructorData || instructorData.length === 0 ? (
        <div className="rounded-xl bg-richblack-800 p-10 text-center">
          <p className="text-xl font-semibold text-richblack-200">No data to visualize yet.</p>
          <p className="text-richblack-400 mt-2">Publish courses and get students enrolled to see insights.</p>
        </div>
      ) : (
        <>
          {/* Toggle */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setChartType('students')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                chartType === 'students'
                  ? 'bg-yellow-50 text-richblack-900'
                  : 'bg-richblack-700 text-richblack-200 hover:bg-richblack-600'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setChartType('revenue')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                chartType === 'revenue'
                  ? 'bg-yellow-50 text-richblack-900'
                  : 'bg-richblack-700 text-richblack-200 hover:bg-richblack-600'
              }`}
            >
              Revenue
            </button>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl bg-richblack-800 p-6">
              <p className="text-lg font-bold mb-4">Distribution</p>
              <div className="max-w-[280px] mx-auto">
                <Pie data={pieData} options={{ plugins: { legend: { labels: { color: '#E2E8F0', boxWidth: 12 } } } }} />
              </div>
            </div>
            <div className="rounded-xl bg-richblack-800 p-6">
              <p className="text-lg font-bold mb-4">Per Course Breakdown</p>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Per-course table */}
          <div className="rounded-xl bg-richblack-800 overflow-hidden">
            <div className="p-6 border-b border-richblack-700">
              <p className="text-lg font-bold">Course Performance</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-richblack-700 text-richblack-200 uppercase text-xs tracking-wider">
                    <th className="px-6 py-3 text-left">Course</th>
                    <th className="px-6 py-3 text-right">Students</th>
                    <th className="px-6 py-3 text-right">Revenue</th>
                    <th className="px-6 py-3 text-right">Avg/Student</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-richblack-700">
                  {instructorData.map((course, idx) => (
                    <tr key={idx} className="hover:bg-richblack-700 transition-colors">
                      <td className="px-6 py-4 font-medium text-richblack-5">{course.courseName}</td>
                      <td className="px-6 py-4 text-right text-richblack-200">{course.totalStudentsEnrolled}</td>
                      <td className="px-6 py-4 text-right text-richblack-200">₹{course.totalAmountGenerated.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-richblack-200">
                        {course.totalStudentsEnrolled > 0
                          ? `₹${Math.round(course.totalAmountGenerated / course.totalStudentsEnrolled)}`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
