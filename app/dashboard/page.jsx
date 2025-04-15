"use client";
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);
const DashBoard = () => {
  
  return (
    useGSAP(() => {
      gsap.from("body", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.6,
      });
    }, []),
    useGSAP(() => {

      const string = document.querySelector("path");
      const svgPath = document.querySelector("svg path");
      const initPath = "M 10 100 Q 500 100 990 100";
      
      string.addEventListener("mousemove", (e) => {
        // Get mouse position relative to the SVG
        const rect = string.getBoundingClientRect();
        const y = e.clientY - rect.top;
      
        // Update path with mouse Y position
        const newPath = `M 10 100 Q ${e.x} ${y} 990 100`;
        
        gsap.to(svgPath, {
          attr: { d: newPath },
          duration: 0.2,
          ease: "power3.out"
        });
      });
      
      string.addEventListener("mouseleave", () => {
        gsap.to(svgPath, {
          attr: { d: initPath },
          duration: 0.8,
          ease: "elastic.out(1, 0.5)"
        });
      });
    }, []),

    <div className='pt-10'>
        <h2 className='font-bold text-2xl'>Dashboard</h2>
        <h2 className='text-gray-500'>Create Your Mock Interview With Ai</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 my-5 rounded-lg text-white'>
          <AddNewInterview />
        </div>
        {/* Previous Interview List */}

        <div className="elastic-container">
             <svg viewBox="0 0 1000 200">
            <path d="M 100 100 Q 500 100 900 100" />
           </svg>
  </div>
        <InterviewList />
    </div>
  )
}

export default DashBoard