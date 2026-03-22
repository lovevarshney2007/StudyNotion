import React, { useEffect, useRef, useState } from 'react'
import logo from "../../Asset/Logo/Logo-Full-Light.png"
import { Link, matchPath, useNavigate } from "react-router-dom"
import { NavbarLinks } from "../../data/Navbar-Link"
import { useLocation } from "react-router-dom"
import { useSelector } from 'react-redux'
import { AiOutlineShoppingCart, AiOutlineSearch } from 'react-icons/ai'
import { RxHamburgerMenu } from 'react-icons/rx'
import { IoClose } from 'react-icons/io5'
import { IoIosArrowDropdownCircle } from "react-icons/io"
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiConnector'
import { categories } from "../../services/apis"

const NavBar = () => {

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)

  const [subLinks, setSubLinks] = useState([])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const fetchSubLinks = async () => {
    try {
      setLoading(true)
      const result = await apiConnector("GET", categories.CATEGORIES_API)
      if (result?.data?.data) {
        setSubLinks(result.data.data)
      }
    } catch (error) {
      console.log("Could not fetch the category list")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubLinks()
  }, [])

  const location = useLocation()
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  const isCatalogActive = location.pathname.startsWith('/catalog')
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim().length > 0) {
      navigate(`/search/${searchQuery}`)
      setSearchQuery("")
      setMobileOpen(false)
    }
  }

  return (
    <div className='relative flex h-14 items-center justify-center border-b border-b-richblack-700 bg-richblack-900 z-50'>
      <div className='flex w-11/12 max-w-maxContent items-center justify-between'>

        {/* Logo */}
        <Link to="/" onClick={() => setMobileOpen(false)}>
          <img src={logo} alt="logo" width={160} height={42} loading='lazy' />
        </Link>

        {/* Desktop Nav Links */}
        <nav className='hidden lg:block'>
          <ul className='flex gap-6 text-richblack-25'>
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className='relative flex items-center gap-1 group cursor-pointer'>
                    <p className={isCatalogActive ? "text-yellow-25" : "text-richblack-25"}>
                      {link.title}
                    </p>
                    <IoIosArrowDropdownCircle
                      className={`transition-transform duration-200 group-hover:rotate-180 ${isCatalogActive ? "text-yellow-25" : "text-richblack-25"}`}
                    />

                    {/* Dropdown panel */}
                    <div className='invisible absolute left-[50%] top-[50%]
                      translate-x-[-50%] translate-y-[50%]
                      flex flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900
                      opacity-0 transition-all duration-200
                      group-hover:visible group-hover:opacity-100 lg:w-[300px] shadow-xl z-50'>

                      {/* Triangle arrow */}
                      <div className='absolute left-[50%] top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm bg-richblack-5' />

                      {loading ? (
                        <p className='text-sm text-richblack-400 py-2'>Loading...</p>
                      ) : subLinks?.length ? (
                        subLinks.map((subLink, i) => (
                          <Link
                            to={`/catalog/${subLink.name?.toLowerCase().replace(/\s+/g, '-')}`}
                            key={i}
                            className='py-2 px-3 text-sm rounded hover:bg-richblack-50 transition-colors duration-150 capitalize'
                          >
                            {subLink.name}
                          </Link>
                        ))
                      ) : (
                        <p className='text-sm text-richblack-400 py-2'>No categories found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p className={matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25 hover:text-richblack-5 transition-colors duration-150"}>
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop: Search/Login/SignUp/Cart/Profile */}
        <div className='hidden lg:flex gap-x-4 items-center'>
          
          <form onSubmit={handleSearch} className='relative mr-2'>
            <input 
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-richblack-800 border border-richblack-700 text-richblack-100 rounded-full py-1.5 px-4 pr-10 text-sm focus:outline-none focus:border-yellow-50"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-richblack-300 hover:text-yellow-50 transition-colors">
              <AiOutlineSearch className='text-lg' />
            </button>
          </form>

          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className='relative text-richblack-100 hover:text-richblack-5 transition-colors duration-150'>
              <AiOutlineShoppingCart className='text-2xl' />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 grid place-items-center rounded-full bg-richblack-600 text-[10px] font-bold text-yellow-5">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <>
              <Link to="/login">
                <button className='border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100 rounded-md text-sm hover:bg-richblack-700 transition-colors duration-150'>
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className='border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100 rounded-md text-sm hover:bg-richblack-700 transition-colors duration-150'>
                  Sign up
                </button>
              </Link>
            </>
          )}
          {token !== null && <ProfileDropDown />}
        </div>

        {/* Mobile: hamburger + cart */}
        <div className='flex items-center gap-x-4 lg:hidden'>
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className='relative text-richblack-100'>
              <AiOutlineShoppingCart className='text-2xl' />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 grid place-items-center rounded-full bg-richblack-600 text-[10px] font-bold text-yellow-5">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(prev => !prev)}
            className='text-richblack-100 text-2xl'
            aria-label="Toggle menu"
          >
            {mobileOpen ? <IoClose /> : <RxHamburgerMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className='absolute top-14 left-0 w-full bg-richblack-800 border-t border-richblack-700 flex flex-col gap-2 px-6 py-4 z-50 shadow-xl lg:hidden'>
          {NavbarLinks.map((link, index) => (
            <div key={index}>
              {link.title === "Catalog" ? (
                <div className='flex flex-col gap-1'>
                  <p className={`font-medium py-2 ${isCatalogActive ? "text-yellow-25" : "text-richblack-25"}`}>
                    Catalog
                  </p>
                  <div className='pl-4 flex flex-col gap-1'>
                    {subLinks?.map((subLink, i) => (
                      <Link
                        to={`/catalog/${subLink.name?.toLowerCase().replace(/\s+/g, '-')}`}
                        key={i}
                        onClick={() => setMobileOpen(false)}
                        className='text-sm text-richblack-200 hover:text-richblack-5 py-1 capitalize'
                      >
                        {subLink.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  to={link?.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2 font-medium ${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}
                >
                  {link.title}
                </Link>
              )}
            </div>
          ))}

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className='relative mt-2 mb-1 px-4'>
            <input 
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-richblack-900 border border-richblack-700 text-richblack-100 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-yellow-50"
            />
            <button type="submit" className="absolute right-7 top-1/2 -translate-y-1/2 text-richblack-300">
              <AiOutlineSearch className='text-xl' />
            </button>
          </form>

          {/* Mobile auth buttons */}
          <div className='flex flex-col gap-3 mt-3 border-t border-richblack-700 pt-3'>
            {token === null ? (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <button className='w-full border border-richblack-700 bg-richblack-900 px-3 py-2 text-richblack-100 rounded-md text-sm'>
                    Log in
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}>
                  <button className='w-full bg-yellow-50 px-3 py-2 text-richblack-900 rounded-md text-sm font-semibold'>
                    Sign up
                  </button>
                </Link>
              </>
            ) : (
              <div onClick={() => setMobileOpen(false)}>
                <ProfileDropDown />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NavBar