import React from 'react'
import {FaArrowRight} from "react-icons/fa"
import {Link} from "react-router-dom"
import HighlightText from '../component/core/HomePage/HighlightText'
import CTAButton from '../component/core/HomePage/Button'
import Banner from "../Asset/Image/banner.mp4"
import CodeBlocks from "../component/core/HomePage/CodeBlock"

const Home = () => {

    return (
        <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between '>

             {/*  Section 1 */}
            <div>
                <Link to={"/signup"}>
                   <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
                    <div className='flex flex-row items-center gap-2  rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>
                            Become an Instructor
                        </p>
                        <FaArrowRight />
                    </div>
                   </div>
                </Link>

                <div className='text-center text-4xl font-semibold mt-7'>
                    Empower Your Future with
                    <HighlightText text={"Coding Skills"}/>
                </div>

                <div className='mt-4 text-center w-[90%] text-lg font-bold text-richblack-300  '>
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
                </div>

                <div className='flex flex-row gap-7 mt-8 justify-center'>
                    <CTAButton active={true} linkto={"/signup"}>
                        Learn More
                    </CTAButton>
                    <CTAButton active={false} linkto={"/login"}>
                        Book Demo
                    </CTAButton>
                </div>


                <div className= 'shadow-blue-200 mx-3 my-15'>
                    <video
                    muted 
                    loop
                    autoPlay
                    > <source src={Banner} type="video/mp4" />
                    </video>
                </div>

             {/* Code Section 1 */}

                <div>
                        <CodeBlocks 
                        position={`lg:flex-row`}
                        heading={
                            <div className='text-4xl font-semibold'>
                                Unblock Your
                                <HighlightText text={"coding courses"} /> 
                                with our online courses
                                </div> 
                        }
                        subheading={
                            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                        }
                        ctabtn1={
                            {
                                btnText:"Try it yourself",
                                linkto:"/signup",
                                active:true,
                            }
                        }
                        ctabtn2={
                            {
                                btnText:"Learn More",
                                linkto:"/login",
                                active:false,
                            }
                        }


                            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                            codeColor={"text-yellow-25"}
                            backgroundGrdient={"bg-gradient-to-br from-yellow-400 to-orange-500"}

                        />
                </div>

                
             {/* Code Section 2 */}

               <div>
                        <CodeBlocks 
                        position={`lg:flex-row-reverse`}
                        heading={
                            <div className='text-4xl font-semibold'>
                                Start
                                <HighlightText text={"coding courses"} /> 
                                coding in seconds
                                </div> 
                        }
                        subheading={
                            "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                        }
                        ctabtn1={
                            {
                                btnText:"Continue Lesseon",
                                linkto:"/signup",
                                active:true,
                            }
                        }
                        ctabtn2={
                            {
                                btnText:"Learn More",
                                linkto:"/login",
                                active:false,
                            }
                        }


                            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                            codeColor={"text-white"}
                            backgroundGrdient={"bg-gradient-to-br from-blue-400 to-cyan-500"}


                        />
                </div>

                

            </div>
   
            {/* Section 2 */}


            {/* Section 3 */}


            {/* Footer */}


        </div>
    )
}


export default Home



