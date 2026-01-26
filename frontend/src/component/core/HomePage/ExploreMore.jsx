import React, { useState } from 'react'
import {HomePageExplore} from "../../../data/homepage-explore"
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';


const tabNames = [
    "Free",
    "New to coding",
    "Most popular",
    "Skill paths",
    "Career paths"
]

const ExploreMore = () => {

    const [currentTab,setCurrentTab] = useState(tabNames[0]);
    const [courses,SetCourses] = useState(HomePageExplore[0].courses);
    const [currentCard,setCurrentCard] = useState(HomePageExplore[0].courses[0].heading)

    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);

        if(!result) return;

        SetCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading)
    }

  return (
    <div>
        <div className='text-4xl font-semibold text-center'>
            Unlock the 
            <HighlightText text={"Power of Code"} />
        </div>

        <p className='text-center text-richblack-300 text-sm text-[16px] mt-3'>
            Learn to build anything you can imagine
        </p>

        {/* Tab  */}

        <div className=' mt-5 flex flex-row rounded-full bg-richblack-800 border-richblack-100 px-1 py-1 mb-10'>
            {
                tabNames.map((element,idx) => {
                    return(
                        <div className={`text-[16px] flex flex-row items-center gap-2  ${currentTab===element ? "bg-richblack-900 text-richblack-5 font-medium":"text-richblack-200 "}
                        px-7 py-[7px]
                        rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 `}
                        key={idx}
                        onClick={() => setMyCards(element)}>
                            {element}
                        </div>
                    )
                })
            }
        </div>

        <div className='lg:h-[150px]'>

            {/* Course card ka group  */}
            <div className='lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3'>
                {
                courses.map((element,index) => {
                    return(
                        <CourseCard 
                        key={index}
                        cardData = {element}
                        currentCard =  {currentCard}
                        setCurrentCard ={setCurrentCard}

                        />
                    )
                })
            }
            </div>

        </div>

    </div>
  )
}

export default ExploreMore