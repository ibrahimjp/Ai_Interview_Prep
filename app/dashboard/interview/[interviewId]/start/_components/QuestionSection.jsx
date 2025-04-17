import { Lightbulb, Volume2, VolumeX } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const QuestionSection = ({ mockInterviewQuestion,activeQuestion }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState(null);

  // Clean up speech when component unmounts or question changes
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Stop any ongoing speech when question changes
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [activeQuestion]);

  const handleTextToSpeech = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis API is not supported in this browser.');
      return;
    }

    // If already speaking, stop it
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Create new speech instance
    const speech = new SpeechSynthesisUtterance(text);
    setCurrentSpeech(speech);

    speech.onend = () => {
      setIsSpeaking(false);
    };

    speech.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(speech);
    setIsSpeaking(true);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!mockInterviewQuestion || mockInterviewQuestion.length === 0) {
    return <div className="p-5 text-center text-gray-500">No questions available</div>;
  }

  return (
    <div className='p-5 border rounded-lg text-black mt-10 container'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4'>
        {mockInterviewQuestion.map((question, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer 
              ${activeQuestion === index ? 'bg-purple-900 text-white' : 'bg-secondary'}`}
          >
            Question #{index + 1}
          </button>
        ))}
      </div>
      
      {/* Current Question Display */}
      <div className='p-4 border rounded-lg bg-gray-100'>
        <div className='flex justify-between items-start'>
          <div>
            <h3 className='font-bold mb-2'>Question {activeQuestion + 1}:</h3>
            <p>{mockInterviewQuestion[activeQuestion]?.question}</p>
          </div>
          <button 
            onClick={() => isSpeaking ? 
              stopSpeaking() : 
              handleTextToSpeech(mockInterviewQuestion[activeQuestion]?.question)
            }
            className='ml-4 p-2 rounded-full hover:bg-gray-200'
            aria-label={isSpeaking ? "Stop reading" : "Read question"}
          >
            {isSpeaking ? (
              <VolumeX className='text-red-500' />
            ) : (
              <Volume2 className='text-purple-900' />
            )}
          </button>
        </div>
        <p className='text-sm text-gray-500 mt-2'>
          Category: {mockInterviewQuestion[activeQuestion]?.type}
        </p>
      </div>

      <div className='border rounded-lg h-40 bg-blue-100 mt-20 p-5'>
        <h2 className='flex gap-2 items-center text-primary'>
          <Lightbulb/>
          <strong>Note</strong>
        </h2>
        <h2 className='text-sm text-primary my-2'>
          Click on Record Answer when you want to answer the question. At the end of interview we will give you the feedback along with correct answer for each of question and your answer to compare it.
        </h2>
      </div>
    </div>
  );
};

export default QuestionSection;