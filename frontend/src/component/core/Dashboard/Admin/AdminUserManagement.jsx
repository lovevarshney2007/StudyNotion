import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAllUsers, toggleUserStatus } from '../../../../services/operations/adminAPI'
import { FiUserCheck, FiUserX, FiSearch } from 'react-icons/fi'

export default function AdminUserManagement() {
  const { token } = useSelector((state) => state.auth)
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [togglingId, setTogglingId] = useState(null)

  useEffect(() => {
    ;(async () => {
      const data = await getAllUsers(token)
      setUsers(data)
      setFiltered(data)
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    let result = users
    if (roleFilter !== 'All') result = result.filter((u) => u.accountType === roleFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (u) =>
          u.firstName?.toLowerCase().includes(q) ||
          u.lastName?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, roleFilter, users])

  const handleToggle = async (userId) => {
    setTogglingId(userId)
    const res = await toggleUserStatus(token, userId)
    if (res?.success) {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, active: !u.active } : u))
      )
    }
    setTogglingId(null)
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
      <h1 className="text-2xl font-bold mb-1">User Management</h1>
      <p className="text-richblack-300 mb-6">{users.length} total users registered</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-richblack-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-richblack-700 pl-10 pr-4 py-2 text-sm text-richblack-5 placeholder-richblack-400 outline-none focus:ring-1 focus:ring-yellow-50"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Student', 'Instructor', 'Admin'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                roleFilter === role
                  ? 'bg-yellow-50 text-richblack-900'
                  : 'bg-richblack-700 text-richblack-200 hover:bg-richblack-600'
              }`}
            >
              {role}
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
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Courses</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-richblack-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-richblack-400">No users found</td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-richblack-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`}
                          alt={user.firstName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="font-medium text-richblack-5">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-richblack-200">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          user.accountType === 'Instructor'
                            ? 'bg-blue-900 text-blue-300'
                            : user.accountType === 'Admin'
                            ? 'bg-pink-900 text-pink-300'
                            : 'bg-yellow-900 text-yellow-300'
                        }`}
                      >
                        {user.accountType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-richblack-200">{user.courses?.length || 0}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          user.active !== false ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                        }`}
                      >
                        {user.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.accountType !== 'Admin' && (
                        <button
                          onClick={() => handleToggle(user._id)}
                          disabled={togglingId === user._id}
                          className="flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 bg-richblack-600 hover:bg-richblack-500 transition-colors disabled:opacity-50"
                        >
                          {user.active !== false ? (
                            <><FiUserX /> Deactivate</>
                          ) : (
                            <><FiUserCheck /> Activate</>
                          )}
                        </button>
                      )}
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
