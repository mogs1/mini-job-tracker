// pages/api/jobs/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Job, JobFormData, APIResponse } from '@/types/job';
import { JobStorage } from '@/utils/jobstorage';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<Job[] | Job>>
) {
  try {
    switch (req.method) {
      case 'GET':
        return handleGetJobs(req, res);
      case 'POST':
        return handleCreateJob(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`,
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

function handleGetJobs(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<Job[]>>
) {
  const jobs = JobStorage.getAllJobs();
  
  // Sort jobs by date added (newest first)
  const sortedJobs = jobs.sort((a, b) => 
    new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  );

  return res.status(200).json({
    success: true,
    data: sortedJobs,
  });
}

function handleCreateJob(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<Job>>
) {
  const { jobTitle, companyName, applicationLink, status, jobDescription }: JobFormData = req.body;

  // Validation
  if (!jobTitle || !companyName || !applicationLink || !status) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: jobTitle, companyName, applicationLink, status',
    });
  }

  // Validate status
  const validStatuses = ['Applied', 'Interviewing', 'Rejected', 'Offer'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid status. Must be one of: Applied, Interviewing, Rejected, Offer',
    });
  }

  // Validate URL format
  const urlPattern = /^https?:\/\/.+/;
  if (!urlPattern.test(applicationLink)) {
    return res.status(400).json({
      success: false,
      error: 'Application link must be a valid URL starting with http:// or https://',
    });
  }

  try {
    const newJob = JobStorage.createJob({
      jobTitle: jobTitle.trim(),
      companyName: companyName.trim(),
      applicationLink: applicationLink.trim(),
      status,
      jobDescription: jobDescription?.trim(),
    });

    return res.status(201).json({
      success: true,
      data: newJob,
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create job application',
    });
  }
}