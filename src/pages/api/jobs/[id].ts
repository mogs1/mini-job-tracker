// pages/api/jobs/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Job, JobFormData, APIResponse } from '@/types/job';
import { JobStorage } from '@/utils/jobstorage';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<Job | null>>
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid job ID',
    });
  }

  try {
    switch (req.method) {
      case 'GET':
        return handleGetJob(id, req, res);
      case 'PUT':
        return handleUpdateJob(id, req, res);
      case 'DELETE':
        return handleDeleteJob(id, req, res);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
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

function handleGetJob(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<Job | null>>
) {
  const job = JobStorage.getJobById(id);
  
  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Job not found',
    });
  }

  return res.status(200).json({
    success: true,
    data: job,
  });
}

function handleUpdateJob(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<Job | null>>
) {
  const { jobTitle, companyName, applicationLink, status, jobDescription }: Partial<JobFormData> = req.body;

  // Check if job exists
  const existingJob = JobStorage.getJobById(id);
  if (!existingJob) {
    return res.status(404).json({
      success: false,
      error: 'Job not found',
    });
  }

  // Validation for provided fields
  if (status) {
    const validStatuses = ['Applied', 'Interviewing', 'Rejected', 'Offer'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: Applied, Interviewing, Rejected, Offer',
      });
    }
  }

  if (applicationLink) {
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(applicationLink)) {
      return res.status(400).json({
        success: false,
        error: 'Application link must be a valid URL starting with http:// or https://',
      });
    }
  }

  try {
    const updates: Partial<Job> = {};
    
    if (jobTitle !== undefined) updates.jobTitle = jobTitle.trim();
    if (companyName !== undefined) updates.companyName = companyName.trim();
    if (applicationLink !== undefined) updates.applicationLink = applicationLink.trim();
    if (status !== undefined) updates.status = status;
    if (jobDescription !== undefined) updates.jobDescription = jobDescription?.trim();

    const updatedJob = JobStorage.updateJob(id, updates);

    return res.status(200).json({
      success: true,
      data: updatedJob,
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update job application',
    });
  }
}

function handleDeleteJob(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<null>>
) {
  try {
    const deleted = JobStorage.deleteJob(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete job application',
    });
  }
}