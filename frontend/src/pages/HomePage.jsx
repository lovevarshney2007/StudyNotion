import React from 'react'
import { FaArrowRight } from "react-icons/fa"
import { Link } from "react-router-dom"
import HighlightText from '../component/core/HomePage/HighlightText'
import CTAButton from '../component/core/HomePage/Button'
import Banner from "../Asset/Image/banner.mp4"
import CodeBlocks from "../component/core/HomePage/CodeBlock"
import TimeLineSection from '../component/core/HomePage/TimeLineSection'
import LearningLanguageSection from '../component/core/HomePage/LearningLanguageSection'
import InstructorSection from "../component/core/HomePage/InstructorSection"
import Footer from "../component/common/Footer"
import ExploreMore from '../component/core/HomePage/ExploreMore'

const Home = () => {
    return (
        <div>
            {/* Section 1 - Dark Background (Centered Content) */}
            <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>

                {/* Become an Instructor Button */}
                <Link to={"/signup"}>
                    <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
                        <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                            <p>Become an Instructor</p>
                            <FaArrowRight />
                        </div>
                    </div>
                </Link>

                {/* Heading */}
                <div className='text-center text-4xl font-semibold mt-7'>
                    Empower Your Future with <HighlightText text={"Coding Skills"} />
                </div>

                {/* Subheading */}
                <div className='mt-4 text-center w-[90%] text-lg font-bold text-richblack-300'>
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                </div>

                {/* Hero Buttons */}
                <div className='flex flex-row gap-7 mt-8 justify-center'>
                    <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
                    <CTAButton active={false} linkto={"/login"}>Book Demo</CTAButton>
                </div>

                {/* Video Section */}
                <div className='shadow-blue-200 mx-3 my-15'>
                    <video muted loop autoPlay>
                        <source src={Banner} type="video/mp4" />
                    </video>
                </div>

                {/* Code Section 1 */}
                <div>
                    <CodeBlocks
                        position={`lg:flex-row`}
                        heading={<div className='text-4xl font-semibold'>Unblock Your <HighlightText text={"coding courses"} /> with our online courses</div>}
                        subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                        ctabtn1={{ btnText: "Try it yourself", linkto: "/signup", active: true }}
                        ctabtn2={{ btnText: "Learn More", linkto: "/login", active: false }}
                        codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                        codeColor={"text-yellow-25"}
                        backgroundGrdient={"bg-gradient-to-br from-yellow-400 to-orange-500"}
                    />
                </div>

                {/* Code Section 2 */}
                <div>
                    <CodeBlocks
                        position={`lg:flex-row-reverse`}
                        heading={<div className='text-4xl font-semibold'>Start <HighlightText text={"coding courses"} /> coding in seconds</div>}
                        subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
                        ctabtn1={{ btnText: "Continue Lesson", linkto: "/signup", active: true }}
                        ctabtn2={{ btnText: "Learn More", linkto: "/login", active: false }}
                        codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                        codeColor={"text-white"}
                        backgroundGrdient={"bg-gradient-to-br from-blue-400 to-cyan-500"}
                    />
                </div>
                    
                    <ExploreMore />
            </div>

            {/* Section 2 */} 
            <div className='bg-pure-greys-5 text-richblack-700'>
                <div className='homepage_bg h-[310px] w-full'>
                    <div className='w-11/12 max-w-maxContent flex flex-col justify-between items-center gap-5 mx-auto'>
                        <div className='h-[150px]'></div>
                        <div className='flex flex-row gap-7 text-white'>
                            <CTAButton active={true} linkto={"/signup"}>
                                <div className='flex items-center gap-3'>Explore Full Catalog <FaArrowRight /></div>
                            </CTAButton>
                            <CTAButton active={false} linkto={"/login"}>
                                <div className='flex items-center gap-3'>Learn More <FaArrowRight /></div>
                            </CTAButton>
                        </div>
                    </div>
                </div>

                <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
                    <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
                        <div className='text-4xl font-semibold w-[45%]'>
                            Get the Skills you need for a <HighlightText text={"Job that is in demand"} />
                        </div>
                        <div className='flex flex-col gap-10 w-[40%] items-start'>
                            <div className='text-[16px]'>
                                The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                            </div>
                            <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
                        </div>
                    </div>

                    <TimeLineSection />
                    <LearningLanguageSection />
                </div>
            </div>

            {/* Section 3 */}

            <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>

                <InstructorSection />

                <h2 className='text-center text-4xl font-semibold mt-10'>Reviews from other learners</h2>

                {/* Review SLider here  */}

            </div>

            {/* Footer  */}

            <Footer />

            

        </div>
    )
}

export default Home


// Home work 

// add shadow 
// add gradient 
// mobile view 


