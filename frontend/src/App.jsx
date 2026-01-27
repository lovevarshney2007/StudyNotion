import { useState } from 'react'

import viteLogo from '/vite.svg'
import './App.css'
import {Route,Routes} from "react-router-dom"
import Home from "./pages/HomePage.jsx"
import Navbar from "./component/common/NavBar.jsx"

function App() {
  return (
    <>
  <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
     <Navbar />
    <Routes>
      <Route path="/" element={<Home />} /> 
    </Routes>
  </div>
    </>
    
  )
}

export default App
