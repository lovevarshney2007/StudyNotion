import React from 'react'
import CTAButton from "./Button"
import HighlightText from './HighlightText'
import {FaArrowRight} from "react-icons/fa"
import {TypeAnimation} from 'react-type-animation'

const CodeBlock = ({
    position,heading,subheading,ctabtn1,ctabtn2,codeblock,backgroundGrdient,codeColor,
}) => {
  return (
    <div className={`flex ${position} my-20 justify-between flex-col lg:gap-10 gap-10`}>

        {/*Section 1 */}
        <div className='w-[100%] lg:w-[50%] flex flex-col gap-8'>
            {heading}

            {/* SubHeading  */}
            <div className='text-richblack-300 text-base font-bold w-[85%] -mt-3'>
                {subheading}
            </div>

            <div className='flex gap-7 mt-7'>
                <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                    <div className='flex gap-2 items-center'>
                        {ctabtn1.btnText}
                        <FaArrowRight />
                    </div>
                </CTAButton>

                  <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                   {ctabtn2.btnText}
                </CTAButton>

            </div>

        </div>
        

        {/* {Session 2} */}
        <div className='relative flex flex-row h-fit text-[10px] w-[100%] py-4 lg:w-[500px] border-2 border-richblack-800 rounded-lg'>
            {/* Hw: Bg-> Gradient  */}

            <div className={`absolute ${backgroundGrdient} w-[370px] h-[257px] rounded-full blur-[80px] opacity-20 -left-[10%] -top-[10%] -z-10 animate-pulse`}></div>

            <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
            </div>

           {/* Code Animation  */}
        <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
             <TypeAnimation
             sequence={[codeblock,2000,""]}
             repeat={Infinity}
             cursor={true}
             style={
                {
                    whiteSpace:"pre-line",
                    display:"block",
                    fontSize:"14px"
                }
             }
             omitDeletionAnimation={true}

             />
            </div>
        </div>

    </div>
  )
}

export default CodeBlock