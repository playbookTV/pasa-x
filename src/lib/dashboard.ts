// Mock implementation for Chrome extension build

export interface ApplicationStats {
  totalApplications: number;
  pending: number;
  interviews: number;
  offers: number;
}

export interface UpcomingApplication {
  id: string;
  company: string;
  date: string;
  jobTitle: string;
  status: string;
}

export interface SavedJob {
  id: string;
  title: string;
  company: string;
  location?: string;
  description: string;
  url: string;
  jobType?: string;
  status: 'SAVED' | 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
  dateApplied?: Date;
  dateCreated: Date;
  notes?: string;
}

// Mock implementation for building the Chrome extension
export async function getDashboardStats(userId: string): Promise<ApplicationStats> {
  // In the real implementation, this would fetch from Prisma
  return {
    totalApplications: 5,
    pending: 2,
    interviews: 2,
    offers: 1
  };
}

export async function getUpcomingApplications(userId: string): Promise<UpcomingApplication[]> {
  // Mock data for testing
  return [
    {
      id: '1',
      company: 'Google',
      date: 'Nov 15, 2023',
      jobTitle: 'Frontend Developer',
      status: 'INTERVIEW'
    },
    {
      id: '2',
      company: 'Microsoft',
      date: 'Nov 17, 2023',
      jobTitle: 'UI/UX Designer',
      status: 'INTERVIEW'
    }
  ];
}

export async function getAllApplications(userId: string): Promise<SavedJob[]> {
  // Mock data for testing
  return [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'Google',
      location: 'Mountain View, CA',
      description: 'We are looking for a frontend developer...',
      url: 'https://example.com/job/1',
      status: 'INTERVIEW',
      dateCreated: new Date('2023-11-01'),
      notes: 'Preparing for technical interview'
    },
    {
      id: '2',
      title: 'UI/UX Designer',
      company: 'Microsoft',
      location: 'Redmond, WA',
      description: 'Join our design team...',
      url: 'https://example.com/job/2',
      status: 'APPLIED',
      dateCreated: new Date('2023-10-25'),
      dateApplied: new Date('2023-10-27')
    },
    {
      id: '3',
      title: 'Full Stack Developer',
      company: 'Amazon',
      location: 'Seattle, WA',
      description: 'Build scalable web applications...',
      url: 'https://example.com/job/3',
      status: 'SAVED',
      dateCreated: new Date('2023-11-05')
    }
  ];
}

export async function getCoverLetters(userId: string) {
  // Mock data for testing
  return [
    {
      id: '1',
      title: 'Google Frontend Developer',
      createdAt: new Date('2023-11-01')
    },
    {
      id: '2',
      title: 'Microsoft Designer Position',
      createdAt: new Date('2023-10-25')
    }
  ];
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  // In a real implementation, this would update the database
  console.log(`Updating application ${applicationId} to status ${status}`);
  return { id: applicationId, status };
}

export async function addApplicationFromDetectedJob(
  userId: string, 
  jobData: {
    title: string;
    company: string;
    location?: string;
    description: string;
    url: string;
    jobType?: string;
  }
) {
  // In a real implementation, this would add to the database
  console.log(`Adding job ${jobData.title} at ${jobData.company} for user ${userId}`);
  return {
    id: Math.random().toString(36).substring(7),
    ...jobData,
    status: 'SAVED',
    dateCreated: new Date()
  };
}

export async function syncDetectedJobs(userId: string): Promise<void> {
  // In a real implementation, this would sync with Chrome storage
  console.log(`Syncing detected jobs for user ${userId}`);
} 