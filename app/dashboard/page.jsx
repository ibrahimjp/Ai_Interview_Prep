"use client";
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./AddNewCardPattern.css";
import "./AddPatternInListInterview.css";
gsap.registerPlugin(useGSAP);
const DashBoard = () => {
  
  return (

      

    <div className='pt-10'>
        <h2 className='font-bold text-2xl'>Dashboard</h2>
        <h2 className='text-gray-500 '>Create Your Mock Interview With Ai</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 my-5 rounded-lg text-white '>
          <AddNewInterview />
        </div>
        {/* Previous Interview List */}


        <InterviewList />
    </div>
  )
}

export default DashBoard