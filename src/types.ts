/**
 * User type for authentication
 */
export interface User {
  id: string;
  email: string;
  name: string;
  hasResume: boolean;
  role: 'user' | 'admin';
  createdAt: string;
}

/**
 * Resume score results
 */
export interface ResumeScoreResults {
  scoreOverall: number;
  scoreKeywords: number;
  scoreFormat: number;
  feedback: string;
}

/**
 * Job details
 */
export interface JobDetails {
  title: string;
  company: string;
  description: string;
  url: string;
}

/**
 * Cover letter generation parameters
 */
export interface CoverLetterParams {
  resumeText: string;
  jobTitle: string;
  jobDescription: string;
  companyName: string;
  userName: string;
  tone?: 'professional' | 'conversational' | 'enthusiastic';
}

/**
 * Authentication context data
 */
export interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
} 