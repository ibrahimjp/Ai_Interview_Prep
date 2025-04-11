import React from 'react';

const QuestionSection = ({ mockInterviewQuestion }) => {
  return (
    <div className='p-5 border rounded-lg'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {mockInterviewQuestion &&
          mockInterviewQuestion.map((question, index) => (
            <h2
              key={index}
              className='p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer'
            >
              Question #{index + 1}: {question.question}
            </h2>
          ))}
      </div>
    </div>
  );
};

export default QuestionSection;
