// utils/jobStorage.ts
import fs from 'fs';
import path from 'path';
import { Job } from '@/types/job';

const DATA_DIR = path.join(process.cwd(), 'data');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize jobs file if it doesn't exist
if (!fs.existsSync(JOBS_FILE)) {
  fs.writeFileSync(JOBS_FILE, JSON.stringify([], null, 2));
}

export class JobStorage {
  private static readJobs(): Job[] {
    try {
      const data = fs.readFileSync(JOBS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading jobs file:', error);
      return [];
    }
  }

  private static writeJobs(jobs: Job[]): void {
    try {
      fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2));
    } catch (error) {
      console.error('Error writing jobs file:', error);
      throw new Error('Failed to save job data');
    }
  }

  static getAllJobs(): Job[] {
    return this.readJobs();
  }

  static getJobById(id: string): Job | null {
    const jobs = this.readJobs();
    return jobs.find(job => job.id === id) || null;
  }

  static createJob(jobData: Omit<Job, 'id' | 'dateAdded'>): Job {
    const jobs = this.readJobs();
    const newJob: Job = {
      ...jobData,
      id: this.generateId(),
      dateAdded: new Date().toISOString(),
    };
    
    jobs.push(newJob);
    this.writeJobs(jobs);
    return newJob;
  }

  static updateJob(id: string, updates: Partial<Job>): Job | null {
    const jobs = this.readJobs();
    const jobIndex = jobs.findIndex(job => job.id === id);
    
    if (jobIndex === -1) {
      return null;
    }

    jobs[jobIndex] = { ...jobs[jobIndex], ...updates };
    this.writeJobs(jobs);
    return jobs[jobIndex];
  }

  static deleteJob(id: string): boolean {
    const jobs = this.readJobs();
    const filteredJobs = jobs.filter(job => job.id !== id);
    
    if (filteredJobs.length === jobs.length) {
      return false; // Job not found
    }
    
    this.writeJobs(filteredJobs);
    return true;
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export default JobStorage;