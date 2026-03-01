import { useState } from 'react'

import viteLogo from '/vite.svg'
import './App.css'
import {Route,Routes} from "react-router-dom"
import Home from "./pages/HomePage.jsx"
import Navbar from "./component/common/NavBar.jsx"
import Catalog from "./pages/CatalogPage.jsx";
import CourseDetails from "./pages/CourseDetails.jsx"
import OpenRoute from "./component/core/Auth/OpenRoute"
import Signup from "./pages/SignupPage.jsx";
import Login from "./pages/LoginPage.jsx"


function App() {
  return (
    <>
  <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
     <Navbar />
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path='catalog/:catalogueName' element={<Catalog/>} />
      <Route path='courses/:courseId' element={<CourseDetails/>} />

      <Route path='signup' element={
        <OpenRoute>
          <Signup />
        </OpenRoute>
      }>
      </Route>

      <Route path='login' element={
        <OpenRoute>
          <Login />
        </OpenRoute>
      }>
      </Route>
    </Routes>
  </div>
    </>
    
  )
}

export default App
