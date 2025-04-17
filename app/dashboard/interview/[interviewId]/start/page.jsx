"use client";
import { db } from "../../../../../utils/db";
import { MockInterview } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation"; 
import QuestionSection from "./_components/QuestionSection";
import RecordAnsSection from "./_components/RecordAnsSection";
import { Button } from "../../../../../@/components/ui/button";
import { Link } from "lucide-react";
import { motion } from "framer-motion";
import "../../../Pattern.css";
const StartInterview = ({ params }) => {
  const { interviewId } = useParams();
  const [interviewDetails, setInterviewDetails] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);

  const GenerateInterviewDetails = useCallback(async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
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

  useEffect(() => {}, [interviewDetails, mockInterviewQuestion]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
        <QuestionSection
          activeQuestion={activeQuestion}
          mockInterviewQuestion={mockInterviewQuestion}
        />
              <div className=" justify-end gap-6 m-10 ">
        {activeQuestion > 0 && <Button className="mr-3 text-white bg-gray-800 hover:bg-gray-300 hover:text-black " onClick={() => setActiveQuestion(activeQuestion - 1)}>Previous Question</Button>}
        {activeQuestion != mockInterviewQuestion.length - 1 && (
          <Button className="mr-3 bg-purple-800 hover:bg-purple-300" onClick={() => setActiveQuestion(activeQuestion + 1)}>Next Question</Button>
        )}
        {activeQuestion === mockInterviewQuestion.length - 1 && (
          <a className="mr-3" href={`/dashboard/interview/${interviewDetails.mockId}/feedback`}>
          <Button className="bg-red-500 hover:bg-red-300">End Interview</Button>
          </a>
        )}
        <RecordAnsSection
          activeQuestion={activeQuestion}
          mockInterviewQuestion={mockInterviewQuestion}
          interviewDetails={interviewDetails}
        />
      </div>
      </div>

    </div>
  );
};

export default StartInterview;
