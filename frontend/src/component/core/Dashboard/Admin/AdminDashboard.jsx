import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getPlatformStats } from '../../../services/operations/adminAPI'
import { Doughnut, Bar } from 'react-chartjs-2'
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

export default function AdminDashboard() {
  const { token } = useSelector((state) => state.auth)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const data = await getPlatformStats(token)
      setStats(data)
      setLoading(false)
    })()
  }, [])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  const doughnutData = {
    labels: ['Students', 'Instructors'],
    datasets: [
      {
        data: [stats?.totalStudents || 0, stats?.totalInstructors || 0],
        backgroundColor: ['#FFD60A', '#06D6A0'],
        borderColor: '#1E293B',
        borderWidth: 2,
      },
    ],
  }

  const courseBarData = {
    labels: ['Published', 'Draft'],
    datasets: [
      {
        label: 'Courses',
        data: [stats?.publishedCourses || 0, stats?.draftCourses || 0],
        backgroundColor: ['#06D6A0', '#EF476F'],
        borderRadius: 6,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { ticks: { color: '#94A3B8' }, grid: { color: '#334155' } },
      y: { ticks: { color: '#94A3B8' }, grid: { color: '#334155' }, beginAtZero: true },
    },
  }

  const cards = [
    { label: 'Total Students',    value: stats?.totalStudents    || 0, gradient: 'from-yellow-400 to-yellow-600' },
    { label: 'Total Instructors', value: stats?.totalInstructors || 0, gradient: 'from-caribbeangreen-300 to-caribbeangreen-500' },
    { label: 'Total Courses',     value: stats?.totalCourses     || 0, gradient: 'from-blue-400 to-blue-600' },
    { label: 'Total Revenue',     value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, gradient: 'from-pink-400 to-pink-600' },
  ]

  return (
    <div className="text-richblack-5">
      <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
      <p className="text-richblack-300 mb-6">Platform-wide overview</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-xl bg-gradient-to-br ${card.gradient} p-px`}>
            <div className="rounded-xl bg-richblack-800 p-5 h-full">
              <p className="text-richblack-300 text-xs uppercase tracking-wider">{card.label}</p>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-richblack-800 p-6">
          <p className="text-lg font-bold mb-4">User Distribution</p>
          <div className="max-w-[260px] mx-auto">
            <Doughnut
              data={doughnutData}
              options={{
                plugins: {
                  legend: { labels: { color: '#E2E8F0' } },
                },
              }}
            />
          </div>
        </div>
        <div className="rounded-xl bg-richblack-800 p-6">
          <p className="text-lg font-bold mb-4">Course Status</p>
          <Bar data={courseBarData} options={barOptions} />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {[
          { label: '→ Manage Users',       path: '/dashboard/admin-users' },
          { label: '→ Manage Instructors', path: '/dashboard/admin-instructors' },
          { label: '→ Manage Courses',     path: '/dashboard/admin-courses' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.path}
            className="rounded-xl bg-richblack-800 p-5 font-semibold text-yellow-50 hover:bg-richblack-700 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}
