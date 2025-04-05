import { useState, useCallback } from 'react';
import * as resumeService from '@/lib/resume';
import { useAuthContext } from '@/lib/auth-context';

export function useResume() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  
  // Upload a resume
  const uploadResume = useCallback(async (file: File) => {
    if (!user) {
      throw new Error('User must be logged in to upload a resume');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await resumeService.uploadResume(user.id, file);
      setResumeData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload resume');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Get a user's resume
  const getResume = useCallback(async () => {
    if (!user) {
      throw new Error('User must be logged in to get resume data');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await resumeService.getResume(user.id);
      setResumeData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get resume');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Analyze a resume against a job description
  const analyzeResume = useCallback(async (
    resumeText: string,
    jobTitle: string,
    jobDescription: string
  ) => {
    if (!user) {
      throw new Error('User must be logged in to analyze a resume');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const results = await resumeService.analyzeResume(resumeText, jobTitle, jobDescription);
      
      // Save the results to the database
      await resumeService.saveResumeScore(user.id, results);
      
      setAnalysisResults(results);
      return results;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze resume');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Extract text from a resume file
  const extractResumeText = useCallback(async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      
      const text = await resumeService.extractResumeText(file);
      return text;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to extract resume text');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    resumeData,
    analysisResults,
    loading,
    error,
    uploadResume,
    getResume,
    analyzeResume,
    extractResumeText,
  };
} 