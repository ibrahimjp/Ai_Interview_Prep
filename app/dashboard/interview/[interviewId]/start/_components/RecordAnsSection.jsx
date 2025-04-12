"use client";
import { Mic, Webcam as WebcamIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../../../../../../@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import dynamic from 'next/dynamic';

// Dynamically import Webcam to avoid SSR issues
const Webcam = dynamic(
  () => import('react-webcam'),
  { ssr: false }
);

const RecordAnsSection = () => {
  const [userAnswer, setUserAnswer] = useState("");
  const webcamRef = React.useRef(null);
  
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    timeout: 5000,
    speechRecognitionProperties: {
      lang: "en-US",
    },
  });

  useEffect(() => {
    if (results.length > 0) {
      const fullTranscript = results.map(result => result.transcript).join(" ");
      setUserAnswer(fullTranscript);
    }
  }, [results]);

  useEffect(() => {
    if (error) {
      console.error("Speech recognition error:", error);
    }
  }, [error]);

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="relative flex flex-col justify-center items-center bg-gray-500 rounded-lg mt-20 p-5 w-full max-w-2xl">
        {/* Fallback when Webcam not available */}
        {typeof window !== 'undefined' && navigator.mediaDevices ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            mirrored={true}
            className="w-full h-[300px] object-cover z-10 rounded-lg"
            screenshotFormat="image/jpeg"
          />
        ) : (
          <div className="w-full h-[300px] bg-gray-800 flex items-center justify-center rounded-lg">
            <WebcamIcon className="h-20 w-20 text-white" />
            <p className="text-white ml-2">Webcam not available</p>
          </div>
        )}
      </div>

      <div className="my-6 w-full max-w-2xl">
        <div className="p-4 border rounded-lg bg-gray-50 min-h-20">
          <p className="font-semibold">Your Answer:</p>
          <p>{interimResult || userAnswer || "Your transcribed answer will appear here..."}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          variant={isRecording ? "destructive" : "outline"} 
          onClick={isRecording ? stopSpeechToText : startSpeechToText}
          className="flex items-center gap-2"
        >
          <Mic className="h-4 w-4" />
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
        
        <Button 
          className="bg-purple-900 hover:bg-purple-800" 
          onClick={() => console.log("User answer:", userAnswer)}
          disabled={!userAnswer}
        >
          Show Full Answer
        </Button>
      </div>
    </div>
  );
};

export default RecordAnsSection;