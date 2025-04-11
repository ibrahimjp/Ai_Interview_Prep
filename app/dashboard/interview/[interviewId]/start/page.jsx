"use client";
import { db } from "../../../../../utils/db";
import { MockInterview } from "../../../../../utils/schema";
import { eq } from 'drizzle-orm';
import React, { useCallback, useEffect, useState } from 'react';
import { use } from 'react'; 
import QuestionSection from './_components/QuestionSection';

const StartInterview = ({ params }) => {
  const { interviewId } = use(params); 
  const [interviewDetails, setInterviewDetails] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [loading, setLoading] = useState(false);

  const GenerateInterviewDetails = useCallback(async () => {
    try {
      setLoading(true);
      const result = await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));
      const jsonMockResp = JSON.parse(result[0].jsonMockResp);
      setMockInterviewQuestion(jsonMockResp);
      setInterviewDetails(result[0]);
    } catch (error) {
      console.error("Failed to fetch interview:", error);
    } finally {
      setLoading(false);
    }
  }, [interviewId]);

  useEffect(() => {
    console.log("Interview ID:", interviewId);
    GenerateInterviewDetails();
  }, [GenerateInterviewDetails]);
  
  useEffect(() => {
    console.log("Fetched Interview Details:", interviewDetails);
    console.log("Questions to Display:", mockInterviewQuestion);
  }, [interviewDetails, mockInterviewQuestion]);

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2'>
        <QuestionSection mockInterviewQuestion={mockInterviewQuestion} />
      </div>
    </div>
  );
};

export default StartInterview;
