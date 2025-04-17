'use client'; 
import { Button } from '../../../@/components/ui/button';
import { useRouter } from 'next/navigation'; 
import React from 'react';

import "../StartButton.css";
const InterviewItemCard = ({ interview }) => {
  const router = useRouter();
  
  if (!interview?.mockId) {
    console.error("Invalid interview data:", interview);

    return <div className="border p-3 text-red-500">Invalid interview data</div>;
  }

  const onStart = () => {
    console.log("Navigating to interview:", interview.mockId); 
    router.push(`/dashboard/interview/${interview.mockId}/start`);
  };

  const onFeedbackParse = () => {
    router.push(`/dashboard/interview/${interview.mockId}/feedback`);
  };

  return (
    <div className='border shadow-sm rounded-lg p-3 bg-black container3'>
      <h2 className='font-bold  text-white'>{interview?.jobPosition}</h2>
      <h2 className='text-sm  text-white'>{interview?.jobExperience} Years Of Experience</h2>
      <h2 className='text-xs  text-white'>Created At: {interview?.createdAt}</h2>
      <div className='flex justify-between mt-2 '>
        <Button 
          className='w-[50%] mr-1 border-amber-900 bg-purple-600 hover:bg-purple-400 button' 
          size='sm' 
          onClick={onFeedbackParse}
        >
          Feedback
        </Button>
        <Button 
          className='w-[50%] border-b-amber-50 bg-[#222222] hover:bg-white hover:text-black ui-btn' 
          size='sm'
          onClick={onStart}
        >
          <span>
          Start
          </span>
        </Button>
      </div>
    </div>
  );
};

export default InterviewItemCard;