"use client";

import React, { useEffect, useState, useCallback, useRef, useMemo, use } from 'react';
import { db } from '../../../../utils/db';
import { MockInterview } from '../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, Webcam as WebcamIcon } from 'lucide-react';
import { Button } from '../../../../@/components/ui/button';
import Webcam from 'react-webcam';
import Link from 'next/link';

const Interview = (props) => {
  const params = use(props.params); // ✅ Unwrap Promise

  const [interviewDetails, setInterviewDetails] = useState(null);
  const [webCamEnable, setWebCamEnable] = useState(false);
  const [loading, setLoading] = useState(true);
  const webcamRef = useRef(null);


  const videoConstraints = useMemo(() => ({
    width: 300,
    height: 300,
    facingMode: "user"
  }), []);

  const GenerateInterviewDetails = useCallback(async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId)); // ✅ fixed typo
      setInterviewDetails(result[0]);
    } catch (error) {
      console.error("Failed to fetch interview:", error);
    } finally {
      setLoading(false);
    }
  }, [params.interviewId]); // ✅ fixed typo

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
    <div className="my-10 ">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side */}
        <div className="flex flex-col my-5 w-full max-w-2xl gap-5">
          <div className="flex flex-col p-5 rounded-lg border">
            <h2 className="text-lg mb-2">
              <strong>Job Role/Position: </strong>
              {interviewDetails.jobPosition}
            </h2>
            <h2 className="text-lg mb-2">
              <strong>Job Description/Tech stack: </strong>
              {interviewDetails.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Your Experience: </strong>
              {interviewDetails.jobExperience} years
            </h2>
          </div>

          <div className="p-5 border rounded-lg border-amber-500 bg-amber-200">
            <h2 className="text-purple-800 flex items-center gap-2">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-yellow-500">
              Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview. 
              It has 5 questions which you can answer and at the last you will get the report 
              on the basis of your answer. 
              <br />
              <strong>NOTE:</strong> We never record your video. You can disable webcam access at any time.
            </h2>
          </div>
        </div>

        {/* Right Side (Webcam) */}
        <div>
          {webCamEnable ? (
              <>
              <Webcam
                ref={webcamRef}
                videoConstraints={videoConstraints}
                className="h-78 rounded-lg border my-7 w-full bg-gradient-to-tr from-gray-900 via-purple-900 to-violet-600
 "
                onUserMedia={() => console.log("Webcam accessed")}
                onUserMediaError={(error) => {
                  console.error("Webcam error:", error);
                  setWebCamEnable(false);
                }}
                mirrored
              />
              <Button
                variant="ghost"
                className="ml-45 bg-white text-purple-800"
                onClick={() => setWebCamEnable(false)}
              >
                Disable Web Cam And Microphone
              </Button>
             </>
            
          ) : (
            <div className="flex flex-col items-center">
              <WebcamIcon className="h-78 p-20 rounded-lg border my-7 w-full " />
              <Button
                className="bg-purple-800 text-white hover:bg-purple-500"
                onClick={() => setWebCamEnable(true)}
              >
                Enable Web Cam And Microphone
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Start Interview Button */}
      <div className="flex justify-center items-end mt-6">
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button className="bg-gray-800 hover:text-black hover:bg-white">Start Interview</Button>
        </Link>
      </div>
    </div>
  );
};

export default Interview;
