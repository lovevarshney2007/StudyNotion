import { apiConnector } from "../apiConnector";
import { toast } from "react-hot-toast";

const BASE = import.meta.env.VITE_APP_BASE_URL || "http://localhost:4000";

const ADMIN_API = {
  GET_STATS: `${BASE}/api/v1/admin/stats`,
  GET_ALL_USERS: `${BASE}/api/v1/admin/users`,
  GET_ALL_INSTRUCTORS: `${BASE}/api/v1/admin/instructors`,
  GET_ALL_COURSES: `${BASE}/api/v1/admin/courses`,
  TOGGLE_USER_STATUS: (userId) => `${BASE}/api/v1/admin/user/${userId}/toggle-status`,
  DELETE_COURSE: (courseId) => `${BASE}/api/v1/admin/course/${courseId}`,
};

export const getPlatformStats = async (token) => {
  try {
    const res = await apiConnector("GET", ADMIN_API.GET_STATS, null, {
      Authorization: `Bearer ${token}`,
    });
    return res.data.data;
  } catch (error) {
    toast.error("Failed to load platform stats");
    return null;
  }
};

export const getAllUsers = async (token) => {
  try {
    const res = await apiConnector("GET", ADMIN_API.GET_ALL_USERS, null, {
      Authorization: `Bearer ${token}`,
    });
    return res.data.data;
  } catch (error) {
    toast.error("Failed to load users");
    return [];
  }
};

export const getAllInstructors = async (token) => {
  try {
    const res = await apiConnector("GET", ADMIN_API.GET_ALL_INSTRUCTORS, null, {
      Authorization: `Bearer ${token}`,
    });
    return res.data.data;
  } catch (error) {
    toast.error("Failed to load instructors");
    return [];
  }
};

export const getAllCoursesAdmin = async (token) => {
  try {
    const res = await apiConnector("GET", ADMIN_API.GET_ALL_COURSES, null, {
      Authorization: `Bearer ${token}`,
    });
    return res.data.data;
  } catch (error) {
    toast.error("Failed to load courses");
    return [];
  }
};

export const toggleUserStatus = async (token, userId) => {
  try {
    const res = await apiConnector("PATCH", ADMIN_API.TOGGLE_USER_STATUS(userId), null, {
      Authorization: `Bearer ${token}`,
    });
    return res.data;
  } catch (error) {
    toast.error("Failed to toggle user status");
    return null;
  }
};

export const deleteCourseAdmin = async (token, courseId) => {
  try {
    const res = await apiConnector("DELETE", ADMIN_API.DELETE_COURSE(courseId), null, {
      Authorization: `Bearer ${token}`,
    });
    toast.success("Course deleted successfully");
    return res.data;
  } catch (error) {
    toast.error("Failed to delete course");
    return null;
  }
};
