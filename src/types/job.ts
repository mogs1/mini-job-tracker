// types/job.ts
export interface Job {
  id: string;
  jobTitle: string;
  companyName: string;
  applicationLink: string;
  status: JobStatus;
  dateAdded: string;
  jobDescription?: string;
  aiAnalysis?: AIAnalysis;
}

export type JobStatus = 'Applied' | 'Interviewing' | 'Rejected' | 'Offer';

export interface AIAnalysis {
  summary: string;
  suggestedSkills: string[];
  analyzedAt: string;
}

export interface JobFormData {
  jobTitle: string;
  companyName: string;
  applicationLink: string;
  status: JobStatus;
  jobDescription?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface JobAnalysisRequest {
  jobDescription: string;
}

export interface JobAnalysisResponse {
  summary: string;
  suggestedSkills: string[];
}

export const JOB_STATUSES: JobStatus[] = ['Applied', 'Interviewing', 'Rejected', 'Offer'];

export const STATUS_COLORS = {
  Applied: 'bg-blue-100 text-blue-800',
  Interviewing: 'bg-yellow-100 text-yellow-800',
  Rejected: 'bg-red-100 text-red-800',
  Offer: 'bg-green-100 text-green-800',
} as const;