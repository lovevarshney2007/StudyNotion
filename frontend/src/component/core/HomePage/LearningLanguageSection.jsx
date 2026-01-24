import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress from "../../../Asset/Image/know_your_progress.png"
import compare_with_others from '../../../Asset/Image/Compare_with_others.png'
import plan_your_lesson from "../../../Asset/Image/know_your_progress.png"
import CTAButton from "./Button"

const LearningLanguageSection = () => {
  return (
    <div className='mt-[150px] mb-32'>
        <div className='flex flex-col gap-5 items-center'>

            <div className='text-4xl font-semibold text-center'>
                Your Swiss Knife for 
                <HighlightText text={"learning any language"} />
            </div>

            <div className='text-center text-richblack-600 mx-auto text-base font-medium w-[70%]'>
                Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
            </div>

            {/* 3 images  */}
            <div className='flex flex-row items-center justify-center mt-5'>

                <img src={know_your_progress} alt="know_your_progress"
                className='object-contain -mr-35'
                
                />
                <img src={compare_with_others} alt="compare_with_others"
                className='object-contain'
                />
                <img src={plan_your_lesson} alt="plan_your_lesson"
                className='object-contain -ml-35'
                />

            </div>

            <div>
              <CTAButton active={true} linkto={"/signup"}>
              <div className='w-fit'>
                Learn More
                </div></CTAButton>
            </div>

        </div>
    </div>
  )
}

export default LearningLanguageSection