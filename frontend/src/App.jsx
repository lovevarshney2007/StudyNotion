import "./App.css"
import { Route, Routes } from "react-router-dom"
import { useSelector } from "react-redux"

import Home from "./pages/HomePage.jsx"
import Navbar from "./component/common/NavBar.jsx"
import OpenRoute from "./component/core/Auth/OpenRoute"
import Catalog from "./pages/CatalogPage.jsx"
import CourseDetails from "./pages/CourseDetailsPage.jsx"
import Signup from "./pages/SignupPage.jsx"
import Login from "./pages/LoginPage.jsx"
import ForgotPassword from "./pages/ForgotPasswordPage.jsx"
import UpdatePassword from "./pages/UpdatePasswordPage.jsx"
import VerifyEmail from "./pages/VerifyEmailPage.jsx"
import About from "./pages/AboutPage.jsx"
import Contact from "./pages/ContactPage.jsx"
import HelpCenter from "./pages/HelpCenterPage.jsx"
import PrivacyPolicy from "./pages/PrivacyPolicyPage.jsx"
import Terms from "./pages/TermsPage.jsx"
import SearchResults from "./pages/SearchResults.jsx"
import MyProfile from "./component/core/Dashboard/MyProfile"
import Dashboard from "./pages/DashboradPage.jsx"
import PrivateRoute from "./component/core/Auth/PrivateRoute"
import Error from "./pages/ErrorPage.jsx"
import Settings from "./component/core/Dashboard/Settings"
import EnrolledCourses from "./component/core/Dashboard/EnrolledCourses"
import Cart from "./component/core/Dashboard/Cart"
import PurchaseHistory from "./component/core/Dashboard/PurchaseHistory.jsx" // Added import
import { ACCOUNT_TYPE } from "./utils/constants"
import AddCourse from "./component/core/Dashboard/AddCourse"
import MyCourses from "./component/core/Dashboard/MyCourses"
import EditCourse from "./component/core/Dashboard/EditCourse"
import ViewCourse from "./pages/ViewCoursePage.jsx"
import VideoDetails from "./component/core/ViewCourse/VideoDetails"
import Instructor from "./component/core/Dashboard/InstructorDashboard/Instructor"

function App() {
  const { user } = useSelector((state) => state.profile)

  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />

        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="help-center" element={<HelpCenter />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="cookie-policy" element={<PrivacyPolicy />} />
        <Route path="search/:searchQuery" element={<SearchResults />} />

        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<MyProfile />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="settings" element={<Settings />} />

          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="cart" element={<Cart />} />
              <Route path="enrolled-courses" element={<EnrolledCourses />} />
              <Route path="purchase-history" element={<PurchaseHistory />} /> {/* Added route */}
            </>
          )}

          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="instructor" element={<Instructor />} />
              <Route path="add-course" element={<AddCourse />} />
              <Route path="my-courses" element={<MyCourses />} />
              <Route path="edit-course/:courseId" element={<EditCourse />} />
            </>
          )}
        </Route>

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <Route
              path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
              element={<VideoDetails />}
            />
          )}
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  )
}

export default App
