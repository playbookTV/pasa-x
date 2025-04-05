import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ClosedWidget } from './ClosedWidget';
import { ClosedJobSiteWidget } from './ClosedJobSiteWidget';
import { OpenNoResumeWidget } from './OpenNoResumeWidget';
import { OpenAnalyseResumeWidget } from './OpenAnalyseResumeWidget';
import { GenerateCoverLetterWidget } from './GenerateCoverLetterWidget';

type WidgetState = 'closed' | 'closedJobSite' | 'openNoResume' | 'openAnalyseResume' | 'generateCoverLetter';

export const FloatingWidget: React.FC = () => {
  const [state, setState] = useState<WidgetState>('closed');
  const [isJobSite, setIsJobSite] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const toggleWidget = () => {
    if (state === 'closed' || state === 'closedJobSite') {
      setState(hasResume ? 'openAnalyseResume' : 'openNoResume');
    } else {
      setState(isJobSite ? 'closedJobSite' : 'closed');
    }
  };

  const handleAutoFill = () => {
    console.log('Auto-fill Application');
  };

  const handleGenerateCoverLetter = () => {
    setState('generateCoverLetter');
  };

  const handleAnalyseResume = () => {
    setState('openAnalyseResume');
  };

  const handleBack = () => {
    setState(hasResume ? 'openAnalyseResume' : 'openNoResume');
  };

  const handleGenerateCoverLetterSubmit = () => {
    console.log('Generating Cover Letter');
    // Here you would typically call an API to generate the cover letter
    // For now, we'll just go back to the previous state
    handleBack();
  };

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
              <ClosedJobSiteWidget onClick={toggleWidget} compatibility={58} />
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
                jobTitle="Software Engineer"
                jobDescription="We are looking for a software engineer with experience in React, TypeScript, and web development."
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
              />
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </motion.div>
  );
};

