'use client'; 
import { Button } from '../../../@/components/ui/button';
import { useRouter } from 'next/navigation'; 
import React from 'react';

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
    <div className='border shadow-sm rounded-lg p-3'>
      <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
      <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years Of Experience</h2>
      <h2 className='text-xs text-gray-400'>Created At: {interview?.createdAt}</h2>
      <div className='flex justify-between mt-2 '>
        <Button 
          className='w-[50%] mr-1 border-amber-900' 
          size='sm' 
          variant='outline'
          onClick={onFeedbackParse}
        >
          Feedback
        </Button>
        <Button 
          className='w-[50%]' 
          size='sm'
          onClick={onStart}
        >
          Start
        </Button>
      </div>
    </div>
  );
};

export default InterviewItemCard;