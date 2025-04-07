import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ClosedWidget } from './ClosedWidget';
import { ClosedJobSiteWidget } from './ClosedJobSiteWidget';
import { OpenNoResumeWidget } from './OpenNoResumeWidget';
import { OpenAnalyseResumeWidget } from './OpenAnalyseResumeWidget';
import { GenerateCoverLetterWidget } from './GenerateCoverLetterWidget';
import JobDetectionCard from './JobDetectionCard';
import { toast } from 'react-hot-toast';
import { JobContext } from '../widget';

type WidgetState = 'closed' | 'closedJobSite' | 'openNoResume' | 'openAnalyseResume' | 'generateCoverLetter' | 'jobDetails';

interface JobInfo {
  title: string;
  company: string;
  location?: string;
  description: string;
  url: string;
  jobType?: string;
  salary?: string;
  saved?: boolean;
  applied?: boolean;
  notes?: string;
  lastDetected?: string;
  detectedOn?: string;
}

export const FloatingWidget: React.FC = () => {
  // Get job info and actions from context
  const { jobInfo, hasResume, actions, disableAnimations } = useContext(JobContext);
  
  const [state, setState] = useState<WidgetState>('closed');
  const [isJobSite, setIsJobSite] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);

  console.log('FloatingWidget rendering with state:', state, 'disableAnimations:', disableAnimations);

  // Update widget state when job info changes
  useEffect(() => {
    if (jobInfo) {
      console.log('Job info changed, updating widget state');
      setIsJobSite(true);
      setState('closedJobSite');
    }
  }, [jobInfo]);

  const toggleWidget = () => {
    console.log('Toggle widget from state:', state);
    if (state === 'closed' || state === 'closedJobSite') {
      if (isJobSite && jobInfo) {
        setState('jobDetails');
      } else {
        setState(hasResume ? 'openAnalyseResume' : 'openNoResume');
      }
    } else {
      setState(isJobSite ? 'closedJobSite' : 'closed');
    }
  };

  const handleAutoFill = () => {
    if (!jobInfo) {
      toast.error('No job data available for auto-fill');
      return;
    }

    // Call the autoFill action from context
    actions.autoFill();
    toast.success('Auto-filling the form...');
  };

  const handleGenerateCoverLetter = () => {
    setState('generateCoverLetter');
  };

  const handleAnalyseResume = () => {
    setState('openAnalyseResume');
  };

  const handleBack = () => {
    if (isJobSite && jobInfo) {
      setState('jobDetails');
    } else {
      setState(hasResume ? 'openAnalyseResume' : 'openNoResume');
    }
  };

  const handleGenerateCoverLetterSubmit = () => {
    setIsLoading(true);
    
    // Call the generateCoverLetter action from context
    actions.generateCoverLetter();
    
    // For demonstration, simulate a delay
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Cover letter generated successfully');
      handleBack();
    }, 2000);
  };

  const handleRefreshJobInfo = () => {
    setIsLoading(true);
    
    // In a real implementation, we would get updated job info
    // from the content script
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Job information refreshed');
    }, 800);
  };

  // If animations are disabled, render a simpler version without Framer Motion
  if (disableAnimations) {
    console.log('Rendering non-animated widget with state:', state);
    return (
      <div
        className="fixed bottom-4 right-4 z-50"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 999999
        }}
      >
        {state === 'closed' && (
          <div onClick={toggleWidget} className="cursor-pointer">
            <div className="p-3 bg-white rounded-3xl shadow-lg flex-col justify-start items-start gap-4 inline-flex">
              <div className="justify-start items-center gap-4 inline-flex">
                <div className="w-11 h-11 relative">
                  <div className="w-11 h-11 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {state === 'closedJobSite' && (
          <ClosedJobSiteWidget 
            onClick={toggleWidget} 
            compatibility={jobInfo?.title ? 58 : 0} 
            title={jobInfo?.title || 'Job Detected'}
          />
        )}

        {state === 'openNoResume' && (
          <OpenNoResumeWidget
            onClose={toggleWidget}
            onAutoFill={handleAutoFill}
            onGenerateCoverLetter={handleGenerateCoverLetter}
            onAnalyseResume={handleAnalyseResume}
          />
        )}

        {state === 'openAnalyseResume' && (
          <OpenAnalyseResumeWidget
            onBack={handleBack}
            onAutoFill={handleAutoFill}
            onGenerateCoverLetter={handleGenerateCoverLetter}
            jobTitle={jobInfo?.title || ""}
            jobDescription={jobInfo?.description || ""}
          />
        )}

        {state === 'generateCoverLetter' && (
          <GenerateCoverLetterWidget
            onBack={handleBack}
            onGenerate={handleGenerateCoverLetterSubmit}
            isLoading={isLoading}
            jobTitle={jobInfo?.title}
            jobCompany={jobInfo?.company}
          />
        )}

        {state === 'jobDetails' && (
          <div style={{ width: '350px' }} className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Job Details</h2>
              <button 
                onClick={toggleWidget}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <JobDetectionCard 
              jobInfo={jobInfo} 
              onGenerateCoverLetter={handleGenerateCoverLetter} 
              onRefresh={handleRefreshJobInfo}
            />
          </div>
        )}
      </div>
    );
  }

  // With animations enabled (original implementation)
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(event, info) => {
        setPosition({ x: info.point.x, y: info.point.y });
      }}
      initial={{ x: 0, y: 0 }}
      animate={{ x: position.x, y: position.y }}
      className="fixed top-4 right-4 z-50"
    >
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {state === 'closed' && (
            <motion.div
              key="closed"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
            >
              <ClosedWidget onClick={toggleWidget} />
            </motion.div>
          )}
          {state === 'closedJobSite' && (
            <motion.div
              key="closedJobSite"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
            >
              <ClosedJobSiteWidget 
                onClick={toggleWidget} 
                compatibility={jobInfo?.title ? 58 : 0} 
                title={jobInfo?.title || 'Job Detected'}
              />
            </motion.div>
          )}
          {state === 'openNoResume' && (
            <motion.div
              key="openNoResume"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
            >
              <OpenNoResumeWidget
                onClose={toggleWidget}
                onAutoFill={handleAutoFill}
                onGenerateCoverLetter={handleGenerateCoverLetter}
                onAnalyseResume={handleAnalyseResume}
              />
            </motion.div>
          )}
          {state === 'openAnalyseResume' && (
            <motion.div
              key="openAnalyseResume"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
            >
              <OpenAnalyseResumeWidget
                onBack={handleBack}
                onAutoFill={handleAutoFill}
                onGenerateCoverLetter={handleGenerateCoverLetter}
                jobTitle={jobInfo?.title || ""}
                jobDescription={jobInfo?.description || ""}
              />
            </motion.div>
          )}
          {state === 'generateCoverLetter' && (
            <motion.div
              key="generateCoverLetter"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
            >
              <GenerateCoverLetterWidget
                onBack={handleBack}
                onGenerate={handleGenerateCoverLetterSubmit}
                isLoading={isLoading}
                jobTitle={jobInfo?.title}
                jobCompany={jobInfo?.company}
              />
            </motion.div>
          )}
          {state === 'jobDetails' && (
            <motion.div
              key="jobDetails"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
              style={{ width: '350px' }}
            >
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Job Details</h2>
                  <button 
                    onClick={toggleWidget}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <JobDetectionCard 
                  jobInfo={jobInfo} 
                  onGenerateCoverLetter={handleGenerateCoverLetter} 
                  onRefresh={handleRefreshJobInfo}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </motion.div>
  );
};

