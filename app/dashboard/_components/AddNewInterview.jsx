"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../@/components/ui/dialog";
import { Button } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import { Textarea } from "../../../@/components/ui/textarea";
import { chatSession ,generateQuestions} from "../../../utils/GeminiAiModel";
import { db } from "../../../utils/db";
import { MockInterview } from "../../../utils/schema";
import {v4 as uuid} from "uuid"
import { useUser } from "@clerk/nextjs";
import moment from 'moment';
import { useRouter } from 'next/navigation';  
import "../MyButton.css"
import "../StartButton.css"

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jsonResponse,setJsonResponse] = useState([]);
  const router=useRouter();
  const user = useUser().user;
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const prompt = `Act as an expert technical interviewer. For a ${jobPosition} position requiring ${experience} years of experience with ${description}, generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5} interview questions. 
      Return ONLY a valid JSON array of question objects, each with "question" and "type" fields. Example:
      [
        {
          "question": "Explain the Virtual DOM in React",
          "type": "Frontend"
        }
      ]`;
      const email = user?.primaryEmailAddress?.emailAddress 
  
      const responseText = await generateQuestions(prompt);

      try {
        console.log("Email:", email);
        if (!email) {
          setError("Please sign in to save interviews");
          return;
        }
    
        // Clean response and parse JSON
        const MockJsonResp = responseText.replace(/```json|```/g, "").trim();
        console.log("Raw response:", MockJsonResp);
        const questions = JSON.parse(MockJsonResp);
        setJsonResponse(questions);
        if (!Array.isArray(questions)) {
          throw new Error("Invalid question format");
        }

        console.log("Generated questions:", questions);
         if(MockJsonResp){
        const resp=await db.insert(MockInterview).values({
          mockId : uuid(),
          jobPosition : jobPosition,
          jobDesc : description,
          jobExperience : experience,
          jsonMockResp : MockJsonResp,
          createdBy : email,
          createdAt : moment().format("DD-MM-YYYY")
        }).returning({mockId:MockInterview.mockId})

        if(resp){
          setOpenDialog(false);
          console.log("Navigating to interview:", resp[0].mockId);
          router.push(`/dashboard/interview/${resp[0].mockId}`)
        }
      }else{
        console.log("error")
      }
      } catch (parseError) {
        console.error("Parsing error:", parseError);
        setError("Received unexpected response format. Please try again.");
      }
    } catch (error) {
      console.error("Generation error:", error);
      setError(error.message || "Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container2 ">
      <div
        className="p-10 border rounded-lg  hover:scale-105  hover:shadow-amber-50 cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="fixed top-100 max-w-2xl bg-[#1e1d1d]">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl text-white">
              Tell Us More About Your Job
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <div className="space-y-4 text-white">
              <h3 className="text-lg font-medium ">
                Add Details About Your Job Position/Role, Job Description And
                Years Of Experience
              </h3>

              {error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded ">
                  {error}
                </div>
              )}

              <div className="space-y-3 text-[#cec2c2]">
                <label>Job Role / Job Position</label>
                <Input
                  placeholder="Ex. Full Stack Developer"
                  required
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                />
              </div>

              <div className="space-y-3 text-[#cec2c2]
              " >
                <label>Job Description / Tech Stack (In Short)</label>
                <Textarea
                  placeholder="Ex. React, Node, Next, MongoDB, Sql, etc...."
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-3 text-[#cec2c2]">
                <label>Years Of Experience</label>
                <Input
                  placeholder="Ex. 5"
                  type="number"
                  required
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-5 mt-6">
              <Button
              className="button"
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button className="ui-btn" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <span>Start</span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;