"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ correct for App Router

import { db } from '../../../../../utils/db';
import { UserAnswer } from '../../../../../utils/schema';
import { eq, desc } from 'drizzle-orm';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../../../@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '../../../../../@/components/ui/button';

const Feedback = ({ params }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const { interviewId } = React.use(params);
  const router = useRouter();

  useEffect(() => {
    getFeedback();
  }, []);

  const getFeedback = async () => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewId)) 
        .orderBy(desc(UserAnswer.id));

      setFeedbackList(result);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  return (
    <div className="p-10">

      {feedbackList?.length === 0 ? (
        <h2 className="font-bold text-xl text-gray-300">No Feedback Found</h2>
      ) : (
        <>
              <h2 className="text-3xl font-bold text-green-500">Congratulations!</h2>
              <h2 className="text-2xl font-bold">Here is your interview feedback</h2>
          <h2 className="text-lg my-3 text-gray-300" >
            Your overall interview rating: <strong>7/10</strong>
          </h2>
          <h2 className="text-sm text-gray-500">
            Find below interview questions with correct answers, your answers, and feedback for improvement
          </h2>

          {feedbackList.map((item, index) => (
            <Collapsible key={index} className="mt-7">
              <CollapsibleTrigger className="p-2 rounded-lg flex justify-between my-2 text-left gap-7 w-full text-white bg-[#222121]">
                {item.question}
                <ChevronsUpDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-2">
                  <h2 className="text-red-500 p-2 border rounded-lg">
                    <strong>Rating:</strong> {item.rating}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                    <strong>Your Answer:</strong> {item.userAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                    <strong>Correct Answer:</strong> {item.correctAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary">
                    <strong>Feedback:</strong> {item.feedback}
                  </h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}

      <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
    </div>
  );
};

export default Feedback;
