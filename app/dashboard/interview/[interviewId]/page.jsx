"use client";
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { db } from '../../../../utils/db';
import { MockInterview } from '../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, Link, Webcam as WebcamIcon } from 'lucide-react';
import { Button } from '../../../../@/components/ui/button';
import Webcam from 'react-webcam';

const Interview = ({params}) => {
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [webCamEnable, setWebCamEnable] = useState(false);
  const [loading, setLoading] = useState(true);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 300,
    height: 300,
    facingMode: "user"
  };

  const GenerateInterviewDetails = useCallback(async () => {
    try {
      setLoading(true);
      const result = await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.intervewId));
      setInterviewDetails(result[0]); // Store first result directly
    } catch (error) {
      console.error("Failed to fetch interview:", error);
    } finally {
      setLoading(false);
    }
  }, [params.intervewId]);

  useEffect(() => {
    GenerateInterviewDetails();
  }, [GenerateInterviewDetails]);

  if (loading) {
    return <div className="text-center my-10">Loading interview details...</div>;
  }

  if (!interviewDetails) {
    return <div className="text-center my-10">Interview not found</div>;
  }

  return (
    <div className='my-10 '>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>

      <div className='flex flex-col my-5 w-full max-w-2xl gap-5 '>
        <div className='flex flex-col p-5 rounded-lg border'>

        <h2 className='text-lg mb-2'>
          <strong>Job Role/Position: </strong>
          {interviewDetails.jobPosition}
        </h2>
        <h2 className='text-lg mb-2'>
          <strong>Job Description/Tech stack: </strong>
          {interviewDetails.jobDesc}
        </h2>
        <h2 className='text-lg'>
          <strong>Your Experience: </strong>
          {interviewDetails.jobExperience} years
        </h2>
        </div>
        <div className='p-5 border rounded-lg border-amber-500 bg-amber-200'>
        <h2 className='text-purple-800'><Lightbulb className='flex items-center'/><strong>Information</strong></h2>
        <h2 className='mt-3 text-yellow-500'>Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview. It has 5 questions which you can answer and at the last you will get the report on the basis of your answer. NOTE: We never record your video. Web cam access you can disable at any time if you want</h2>
        </div>
      </div>
      
      <div className=''>
        {webCamEnable ? (
          <Webcam
            ref={webcamRef}
            videoConstraints={videoConstraints}
            className="rounded-lg border my-7"
            onUserMedia={() => console.log("Webcam accessed")}
            onUserMediaError={(error) => {
              console.error("Webcam error:", error);
              setWebCamEnable(false);
            }}
            mirrored={true}
          />
        ) : (
          <div className='flex flex-col items-center'>
            <WebcamIcon className='h-78 p-20 rounded-lg border my-7 w-full bg-secondary' />
            <Button
            variant="ghost"
            className="bg-purple-800" onClick={() => setWebCamEnable(true)}>
              Enable Web Cam And Microphone
            </Button>
          </div>
        )}
      </div>
      </div>
      <div className='flex justify-center items-end'>
<Link href={`/dashboard/interview/${params.intervewId}/start`}>
<Button className="">Start Interview</Button>
</Link>

</div>
    </div>
    
  );
};

export default Interview;