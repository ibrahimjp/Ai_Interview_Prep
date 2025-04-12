"use client";
import { db } from "../../../../../utils/db";
import { MockInterview } from "../../../../../utils/schema";
import { eq } from 'drizzle-orm';
import React, { useCallback, useEffect, useState } from 'react';
import { use } from 'react'; 
import QuestionSection from './_components/QuestionSection';
import RecordAnsSection from './_components/RecordAnsSection';
const StartInterview = ({ params }) => {
  const { interviewId } = use(params); 
  const [interviewDetails, setInterviewDetails] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);

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
    GenerateInterviewDetails();
  }, [GenerateInterviewDetails]);
  
  useEffect(() => {
  }, [interviewDetails, mockInterviewQuestion]);

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <QuestionSection activeQuestion={activeQuestion} mockInterviewQuestion={mockInterviewQuestion} />
        <RecordAnsSection />
      </div>
    </div>
  );
};

export default StartInterview;
