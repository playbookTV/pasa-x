import React from 'react';
import { Button } from './Button';

interface ResumeScoreResults {
  scoreOverall: number;
  scoreKeywords: number;
  scoreFormat: number;
  feedback: string;
}

interface ResumeAnalysisResultsProps {
  results: ResumeScoreResults;
  jobTitle?: string;
  onGenerateCoverLetter?: () => void;
  onClose?: () => void;
}

export const ResumeAnalysisResults: React.FC<ResumeAnalysisResultsProps> = ({
  results,
  jobTitle = 'this position',
  onGenerateCoverLetter,
  onClose,
}) => {
  const { scoreOverall, scoreKeywords, scoreFormat, feedback } = results;
  
  // Format feedback text with line breaks
  const formattedFeedback = feedback.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));
  
  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Resume Analysis</h2>
        {onClose && (
          <Button variant="secondary" size="small" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Match Score</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{scoreOverall}%</span>
            <div className={`w-3 h-3 rounded-full ${getScoreColorClass(scoreOverall)}`}></div>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Keywords</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{scoreKeywords}%</span>
              <div className={`w-2 h-2 rounded-full ${getScoreColorClass(scoreKeywords)}`}></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Format</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{scoreFormat}%</span>
              <div className={`w-2 h-2 rounded-full ${getScoreColorClass(scoreFormat)}`}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">Feedback</h3>
        <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
          {formattedFeedback}
        </div>
      </div>
      
      {onGenerateCoverLetter && (
        <Button 
          variant="primary" 
          size="large" 
          onClick={onGenerateCoverLetter}
          className="mt-2"
        >
          Generate Cover Letter
        </Button>
      )}
    </div>
  );
};

// Helper function to get color class based on score
function getScoreColorClass(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
} 