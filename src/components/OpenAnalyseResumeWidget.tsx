import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { useResume } from '@/hooks/use-resume';
import { useAuthContext } from '@/lib/auth-context';
import { ResumeAnalysisResults } from './ResumeAnalysisResults';
import { Toast } from './Toast';

interface OpenAnalyseResumeWidgetProps {
  onBack: () => void;
  onAutoFill: () => void;
  onGenerateCoverLetter: () => void;
  jobTitle?: string;
  jobDescription?: string;
}

export const OpenAnalyseResumeWidget: React.FC<OpenAnalyseResumeWidgetProps> = ({
  onBack,
  onAutoFill,
  onGenerateCoverLetter,
  jobTitle = 'Software Engineer',
  jobDescription = 'We are looking for a software engineer with experience in React, TypeScript, and web development.',
}) => {
  const { user } = useAuthContext();
  const { getResume, analyzeResume, extractResumeText, loading, error, resumeData, analysisResults } = useResume();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [viewMode, setViewMode] = useState<'analyzing' | 'results'>('analyzing');

  // Keywords extracted from job description
  const [keywords, setKeywords] = useState<Array<{ name: string; matched: boolean }>>([]);

  // Get resume data and analyze on mount
  useEffect(() => {
    const loadResumeAndAnalyze = async () => {
      try {
        // Get user's resume
        if (user) {
          const resume = await getResume();
          
          if (resume) {
            // In a real implementation, we would extract text from the resume file
            // and analyze it against the job description
            const mockResumeText = 'Experience with React, TypeScript, and Node.js. Skilled in UX Research.';
            
            // Analyze resume against job description
            await analyzeResume(mockResumeText, jobTitle, jobDescription);
            
            // Extract keywords from job description (simplified mock version)
            extractKeywordsFromJobDescription(jobDescription, mockResumeText);
            
            setViewMode('results');
          }
        }
      } catch (err) {
        setToastMessage(err instanceof Error ? err.message : 'Failed to analyze resume');
        setToastType('error');
        setShowToast(true);
      }
    };
    
    loadResumeAndAnalyze();
  }, [user, getResume, analyzeResume, jobTitle, jobDescription]);
  
  // Extract keywords from job description and check if they appear in resume
  const extractKeywordsFromJobDescription = (jobDesc: string, resumeText: string) => {
    // Simple keyword extraction (would be more sophisticated in a real app)
    const keywordsList = [
      'React', 
      'TypeScript', 
      'JavaScript',
      'Web Development',
      'UX Research',
      'Node.js'
    ];
    
    const keywordsWithMatches = keywordsList.map(keyword => ({
      name: keyword,
      matched: resumeText.toLowerCase().includes(keyword.toLowerCase())
    }));
    
    setKeywords(keywordsWithMatches);
  };

  // If loading or no analysis results yet, show loading state
  if (loading || (viewMode === 'analyzing' && !analysisResults)) {
    return (
      <div className="w-80 h-96 p-2.5 justify-start items-start gap-2.5 inline-flex overflow-hidden">
        <div className="grow shrink basis-0 px-3 pt-4 pb-3 bg-white rounded-xl shadow-[0px_0px_2px_0px_rgba(0,0,0,0.15)] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.04)] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.05)] flex-col justify-start items-start gap-4 inline-flex overflow-hidden">
          <div className="self-stretch justify-between items-center inline-flex">
            <button onClick={onBack} className="justify-center items-center gap-1 flex">
              <ArrowLeft className="w-4 h-6" />
              <div className="text-slate-900 text-sm font-semibold font-['Inter'] leading-tight">Back</div>
            </button>
          </div>
          <div className="self-stretch h-80 flex-col justify-center items-center gap-4 flex">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
            <div className="text-stone-950 text-xl font-semibold font-['Inter']">Analyzing Resume...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show analysis results
  return (
    <div className="w-80 h-auto p-2.5 justify-start items-start gap-2.5 inline-flex overflow-hidden">
      <div className="grow shrink basis-0 px-3 pt-4 pb-3 bg-white rounded-xl shadow-[0px_0px_2px_0px_rgba(0,0,0,0.15)] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.04)] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.05)] flex-col justify-start items-start gap-4 inline-flex overflow-hidden">
        <div className="self-stretch justify-between items-center inline-flex">
          <button onClick={onBack} className="justify-center items-center gap-1 flex">
            <ArrowLeft className="w-4 h-6" />
            <div className="text-slate-900 text-sm font-semibold font-['Inter'] leading-tight">Back</div>
          </button>
        </div>
        
        <div className="self-stretch h-auto p-4 bg-stone-100 rounded-lg flex-col justify-start items-center gap-6 flex overflow-hidden">
          <div className="self-stretch text-neutral-800 text-xl font-semibold font-['Inter']">
            Resume Analysis for {jobTitle}
          </div>
          
          {analysisResults && (
            <div className="self-stretch flex-col justify-start items-center gap-3.5 flex">
              <div className="w-24 h-24 relative">
                <div className="left-[21.97px] top-[31.54px] absolute text-zinc-900 text-3xl font-extrabold font-['Inter']">
                  {analysisResults.scoreOverall}%
                </div>
                <div className="left-[21.61px] top-[63.37px] absolute text-zinc-900 text-xs font-medium font-['Inter']">
                  Compatible
                </div>
                <div className="w-24 h-24 left-0 top-0 absolute">
                  <div className="w-24 h-24 left-0 top-0 absolute rounded-full border-8 border-black/10" />
                  <div 
                    className="w-24 h-24 left-0 top-0 absolute rounded-full border-8 border-indigo-600" 
                    style={{ clipPath: `inset(0 ${100 - analysisResults.scoreOverall}% 0 0)` }} 
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="self-stretch flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch flex-col justify-start items-start gap-2.5 flex">
              <div className="self-stretch text-stone-950 text-base font-bold font-['Inter']">Keywords</div>
              <div className="self-stretch p-4 rounded-xl border border-black/10 flex-col justify-start items-start gap-4 flex">
                <div className="self-stretch text-zinc-900 text-sm font-normal font-['Inter'] leading-tight">
                  Your resume has {keywords.filter(k => k.matched).length} out of {keywords.length} keywords that appear in the job description. Try to get your score above 70% to increase your chances.
                </div>
                <div className="self-stretch justify-start items-start gap-2 inline-flex flex-wrap">
                  {keywords.map((keyword, index) => (
                    <div key={index} className={`p-2 bg-white rounded-2xl border border-neutral-200/90 justify-center items-center gap-1 flex overflow-hidden ${keyword.matched ? '' : 'opacity-30'}`}>
                      <div className="text-stone-950 text-sm font-medium font-['Inter']">{keyword.name}</div>
                      {keyword.matched && <Check className="w-3.5 h-3.5" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {analysisResults && (
              <div className="self-stretch p-4 bg-white rounded-xl border border-black/10 flex-col justify-start items-start gap-2 flex mt-2">
                <div className="self-stretch text-stone-950 text-base font-bold font-['Inter']">Feedback</div>
                <div className="self-stretch text-zinc-900 text-sm font-normal font-['Inter'] leading-tight whitespace-pre-wrap">
                  {analysisResults.feedback}
                </div>
              </div>
            )}
            
            <div className="self-stretch flex-col justify-start items-start gap-4 flex mt-4">
              <Button variant="primary" onClick={onAutoFill} className="w-full">
                Auto-fill Application
              </Button>
              <Button variant="secondary" onClick={onGenerateCoverLetter} className="w-full">
                Generate Cover Letter
              </Button>
            </div>
          </div>
        </div>
        
        {showToast && (
          <Toast
            message={toastMessage}
            title={toastType === 'success' ? 'Success' : 'Error'}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
};

