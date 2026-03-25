import { ACCOUNT_TYPE } from "../utils/constants"

export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscVm",
  },
  {
    id: 4,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscAdd",
  },
  {
    id: 9,
    name: "Insights",
    path: "/dashboard/instructor-insights",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscGraph",
  },
  {
    id: 5,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },
  {
    id: 7,
    name: "Cart",
    path: "/dashboard/cart",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscArchive",
  },
  {
    id: 8,
    name: "Purchase History",
    path: "/dashboard/purchase-history",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscHistory",
  },
  // Admin links
  {
    id: 10,
    name: "Admin Dashboard",
    path: "/dashboard/admin",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscServer",
  },
  {
    id: 11,
    name: "Manage Users",
    path: "/dashboard/admin-users",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscPerson",
  },
  {
    id: 12,
    name: "Manage Instructors",
    path: "/dashboard/admin-instructors",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscOrganization",
  },
  {
    id: 13,
    name: "Manage Courses",
    path: "/dashboard/admin-courses",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscBook",
  },
]

