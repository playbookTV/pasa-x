// Resume service for Pasa
import * as db from './db';
import * as storage from './storage';

// OpenAI API key for resume analysis
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

interface ResumeScoreResults {
  scoreOverall: number;
  scoreKeywords: number;
  scoreFormat: number;
  feedback: string;
}

/**
 * Upload a resume for a user
 * @param userId User ID
 * @param file Resume file
 * @returns Resume details
 */
export async function uploadResume(userId: string, file: File) {
  try {
    // Upload the file to Cloudflare R2
    const fileUrl = await storage.uploadFile(file, userId, 'resume');
    
    // Save the resume details in the database
    const resume = await db.createOrUpdateResume(userId, {
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
    });
    
    // Update user's hasResume status
    await db.prisma.user.update({
      where: { id: userId },
      data: { hasResume: true },
    });
    
    return resume;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw new Error('Failed to upload resume');
  }
}

/**
 * Get a user's resume
 * @param userId User ID
 * @returns Resume details
 */
export async function getResume(userId: string) {
  try {
    return await db.getResumeByUserId(userId);
  } catch (error) {
    console.error('Error getting resume:', error);
    throw new Error('Failed to get resume');
  }
}

/**
 * Analyze a resume against a job description
 * @param resumeText Resume text content
 * @param jobTitle Job title
 * @param jobDescription Job description
 * @returns Resume score results
 */
export async function analyzeResume(
  resumeText: string,
  jobTitle: string,
  jobDescription: string
): Promise<ResumeScoreResults> {
  try {
    // If OpenAI API key is not available, return mock results
    if (!OPENAI_API_KEY) {
      console.log('OpenAI API key not found, returning mock results');
      return getMockResumeScore(jobTitle);
    }
    
    // In a real implementation, we would call the OpenAI API here
    // For now, we'll return mock results
    return getMockResumeScore(jobTitle);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume');
  }
}

/**
 * Save resume score results to the database
 * @param userId User ID
 * @param results Resume score results
 * @returns Updated resume details
 */
export async function saveResumeScore(userId: string, results: ResumeScoreResults) {
  try {
    // Get current resume to maintain file info
    const currentResume = await db.getResumeByUserId(userId);
    
    if (!currentResume) {
      throw new Error('No resume found for user');
    }
    
    // Update with scores while keeping file info
    return await db.createOrUpdateResume(userId, {
      fileUrl: currentResume.fileUrl,
      fileName: currentResume.fileName,
      fileSize: currentResume.fileSize,
      scoreOverall: results.scoreOverall,
      scoreKeywords: results.scoreKeywords,
      scoreFormat: results.scoreFormat,
      feedback: results.feedback,
    });
  } catch (error) {
    console.error('Error saving resume score:', error);
    throw new Error('Failed to save resume score');
  }
}

/**
 * Extract text from a resume file
 * @param file Resume file
 * @returns Text content of the resume
 */
export async function extractResumeText(file: File): Promise<string> {
  try {
    // In a real implementation, this would use a PDF parsing library
    // For now, we'll return mock text for demonstration
    
    if (file.type === 'application/pdf') {
      return 'Mock resume text extracted from PDF file';
    } else if (file.type.includes('word')) {
      return 'Mock resume text extracted from Word file';
    } else {
      // For plain text or other formats
      return await file.text();
    }
  } catch (error) {
    console.error('Error extracting resume text:', error);
    throw new Error('Failed to extract text from resume');
  }
}

/**
 * Get mock resume score results for demonstration
 * @param jobTitle Job title
 * @returns Mock resume score results
 */
function getMockResumeScore(jobTitle: string): ResumeScoreResults {
  // Generate scores between 60-90
  const scoreOverall = Math.floor(Math.random() * 31) + 60;
  const scoreKeywords = Math.floor(Math.random() * 31) + 60;
  const scoreFormat = Math.floor(Math.random() * 31) + 60;
  
  // Generate feedback based on job title
  const feedback = `
Your resume is ${scoreOverall >= 80 ? 'well-matched' : 'somewhat matched'} for the ${jobTitle} position.

Strengths:
- Good education and qualification section
- Clear work history with relevant experience
${scoreKeywords >= 80 ? '- Excellent keyword matching with job requirements' : '- Some keywords match the job requirements'}

Improvement areas:
${scoreFormat < 80 ? '- Could improve resume formatting for better readability' : '- Format is clear and professional'}
${scoreKeywords < 80 ? '- Add more industry-specific keywords like: agile, CI/CD, cross-functional' : ''}
${scoreOverall < 80 ? '- Quantify your achievements with specific metrics and results' : ''}

Overall recommendation:
${scoreOverall >= 80 
  ? 'Your resume is well-positioned for this role. Consider applying right away.' 
  : 'With some targeted improvements, your resume could be more competitive for this position.'}
`;

  return {
    scoreOverall,
    scoreKeywords,
    scoreFormat,
    feedback,
  };
} 