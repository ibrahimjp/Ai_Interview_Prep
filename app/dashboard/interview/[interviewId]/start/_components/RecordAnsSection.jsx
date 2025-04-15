"use client";
import { Mic, Webcam as WebcamIcon, AlertCircle } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "../../../../../../@/components/ui/button";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../../../../utils/db";
import { chatSession } from "../../../../../../utils/GeminiAiModel";
import moment from "moment";
import { UserAnswer } from "../../../../../../utils/schema";

const Webcam = dynamic(
  () => import("react-webcam").then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] bg-gray-800 flex items-center justify-center rounded-lg">
        <WebcamIcon className="h-20 w-20 text-white" />
        <p className="text-white ml-2">Loading webcam...</p>
      </div>
    )
  }
);

const RecordAnsSection = ({
  mockInterviewQuestion,
  activeQuestion,
  interviewDetails,
}) => {
  const [loading, setLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [cameraError, setCameraError] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const webcamRef = useRef(null);
  const recognitionRef = useRef(null);
  const { user } = useUser();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          setUserAnswer(transcript);
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          toast.error(`Speech recognition error: ${event.error}`);
          setIsRecording(false);
        };
      } else {
        toast.error("Speech recognition not supported in your browser");
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Handle camera access
  useEffect(() => {
    const checkCamera = async () => {
      try {
        if (typeof window !== "undefined" && navigator.mediaDevices) {
          await navigator.mediaDevices.getUserMedia({ video: true });
        }
      } catch (err) {
        setCameraError("Camera access denied or not available");
        toast.error("Camera access denied. Please enable camera permissions.");
      }
    };
    checkCamera();
  }, []);

  const processInterviewAnswer = async () => {
    setLoading(true);
    try {
      const feedbackPrompt = `
        Question: ${mockInterviewQuestion[activeQuestion]?.question}
        
        Answer: ${userAnswer}
        
        Please evaluate this interview answer and provide:
        1. A rating out of 10
        2. Specific feedback on areas for improvement
        3. Positive aspects of the answer
        
        Format your response as JSON with "rating" and "feedback" fields.
      `;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const MockJsonResp = result.response.text().replace(/```json|```/g, "").trim();
      const JsonFeedbackResp = JSON.parse(MockJsonResp);

      // Using UserAnswer schema instead of MockAnswer
      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewDetails.mockId,
        question: mockInterviewQuestion[activeQuestion]?.question || '',
        correctAns: mockInterviewQuestion[activeQuestion]?.answer || '',
        userAns: userAnswer,
        feedback: JsonFeedbackResp.feedback || '',
        rating: JsonFeedbackResp.rating?.toString() || '0', // Convert to string if needed
        userEmail: user.primaryEmailAddress.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      });

      if (resp) {
        console.log(JsonFeedbackResp);
        toast.success("Answer saved successfully");
        setUserAnswer("");
      }
    } catch (error) {
      console.error("Error processing answer:", error);
      toast.error("Failed to save answer: " + error.message);
    } finally {
      setUserAnswer("");
      setLoading(false);
    }
  };

  const handleRecording = async () => {
    if (!speechSupported) {
      toast.error("Speech recognition not available");
      return;
    }

    try {
      if (isRecording) {
        recognitionRef.current.stop(); // stops the recording
        setIsRecording(false);
        if (userAnswer.length > 0) {
          await processInterviewAnswer();
        }
        toast.success("Recording stopped");
      } else {
        // Request microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Clean up
        
        recognitionRef.current.start();
        setIsRecording(true);
        toast.success("Recording started - speak now");
      }
    } catch (err) {
      console.error("Recording error:", err);
      toast.error(`Recording failed: ${err.message}`);
      setIsRecording(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col ">
      {/* Webcam Section */}
      <div className="relative flex flex-col justify-center items-center bg-gray-500 rounded-lg mt-20 p-5 w-full max-w-2xl">
        {cameraError ? (
          <div className="w-full h-[300px] bg-gray-800 flex items-center justify-center rounded-lg">
            <WebcamIcon className="h-20 w-20 text-white" />
            <p className="text-white ml-2">{cameraError}</p>
          </div>
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            mirrored={true}
            className="w-full h-[300px] object-cover z-10 rounded-lg"
            screenshotFormat="image/jpeg"
            onUserMediaError={(err) => {
              setCameraError("Failed to access camera");
              console.error("Webcam error:", err);
            }}
          />
        )}
      </div>


<br/>
      {/* Recording Button */}
      <div className="flex gap-4 items-center">
        {!speechSupported && (
          <div className="flex items-center text-red-500">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>Speech recognition not supported</span>
          </div>
        )}
        
        <Button
          disabled={loading || !speechSupported}
          variant={isRecording ? "destructive" : "outline"}
          onClick={handleRecording}
          className="flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-300 hover:text-black"
        >
          <Mic className="h-4 w-4" />
          {isRecording ? (
            <>
              <span className="animate-pulse">●</span> Stop Recording
            </>
          ) : (
            "Start Recording"
          )}
        </Button>
      </div>
    </div>
  );
};

export default RecordAnsSection;