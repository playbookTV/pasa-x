import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { toast } from 'react-hot-toast';

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
}

interface StoredJob {
  url: string;
  saved?: boolean;
  applied?: boolean;
  notes?: string;
  [key: string]: any;
}

interface JobDetectionCardProps {
  jobInfo: JobInfo | null;
  onGenerateCoverLetter?: () => void;
  onRefresh?: () => void;
}

const JobDetectionCard: React.FC<JobDetectionCardProps> = ({ 
  jobInfo, 
  onGenerateCoverLetter,
  onRefresh
}) => {
  const [notes, setNotes] = useState(jobInfo?.notes || '');
  const [isSaved, setIsSaved] = useState(!!jobInfo?.saved);
  const [isApplied, setIsApplied] = useState(!!jobInfo?.applied);

  if (!jobInfo) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Job Detected</CardTitle>
          <CardDescription>
            Visit a job posting page to detect job information.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <p className="text-muted-foreground text-center">
            No job details available. Visit job sites like LinkedIn, Indeed, or Glassdoor to detect jobs.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={onRefresh}>
            Refresh
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const handleSaveJob = () => {
    // Send message to background script to save job
    chrome.runtime.sendMessage({
      type: 'SAVE_JOB',
      data: { url: jobInfo.url }
    }, (response) => {
      if (response.success) {
        toast.success('Job saved successfully');
        setIsSaved(true);
      }
    });
  };

  const handleMarkApplied = () => {
    // Send message to background script to mark job as applied
    chrome.runtime.sendMessage({
      type: 'MARK_APPLIED',
      data: { url: jobInfo.url }
    }, (response) => {
      if (response.success) {
        toast.success('Job marked as applied');
        setIsApplied(true);
      }
    });
  };

  const handleSaveNotes = () => {
    // Update notes in storage
    chrome.storage.local.get(['detectedJobs'], (result) => {
      const jobs = result.detectedJobs || [];
      const jobIndex = jobs.findIndex((job: StoredJob) => job.url === jobInfo.url);
      
      if (jobIndex >= 0) {
        jobs[jobIndex].notes = notes;
        chrome.storage.local.set({ detectedJobs: jobs }, () => {
          toast.success('Notes saved');
        });
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{jobInfo.title}</CardTitle>
            <CardDescription className="text-base mt-1">
              {jobInfo.company}{jobInfo.location ? ` • ${jobInfo.location}` : ''}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {jobInfo.jobType && (
              <Badge variant="outline">{jobInfo.jobType}</Badge>
            )}
            {jobInfo.salary && (
              <Badge variant="secondary">{jobInfo.salary}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-60 overflow-y-auto">
          <h3 className="font-medium mb-1">Job Description</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {jobInfo.description.substring(0, 500)}
            {jobInfo.description.length > 500 && '...'}
          </p>
          <a 
            href={jobInfo.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline mt-2 inline-block"
          >
            View full job posting
          </a>
        </div>

        <div>
          <h3 className="font-medium mb-1">Notes</h3>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes about this job..."
            className="min-h-[80px]"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSaveNotes}
            className="mt-2"
          >
            Save Notes
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          className="w-full" 
          variant={isSaved ? "outline" : "default"}
          onClick={handleSaveJob}
          disabled={isSaved}
        >
          {isSaved ? 'Saved' : 'Save Job'}
        </Button>
        <Button 
          className="w-full" 
          variant={isApplied ? "outline" : "secondary"}
          onClick={handleMarkApplied}
          disabled={isApplied}
        >
          {isApplied ? 'Applied' : 'Mark as Applied'}
        </Button>
        {onGenerateCoverLetter && (
          <Button 
            className="w-full" 
            variant="default"
            onClick={onGenerateCoverLetter}
          >
            Generate Cover Letter
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobDetectionCard; 