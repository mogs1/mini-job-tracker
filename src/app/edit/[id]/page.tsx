// pages/edit/[id].tsx
'use client';

import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import JobForm from '@/components/JobForm';
import JobAnalyzer from '@/components/JobAnalyzer';
import { Job, JobFormData, APIResponse } from '@/types/job';
import { ArrowLeft, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const EditJobPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchJob(id);
    }
  }, [id]);

  const fetchJob = async (jobId: string) => {
    try {
      setIsLoading(true);
      setLoadError(null);

      const response = await fetch('/api/jobs');
      const result: APIResponse<Job[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch jobs');
      }

      const foundJob = result.data?.find(j => j.id === jobId);
      
      if (!foundJob) {
        throw new Error('Job not found');
      }

      setJob(foundJob);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setLoadError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: JobFormData) => {
    if (!id || typeof id !== 'string') return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: APIResponse<Job> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to update job application');
      }

      setSubmitSuccess(true);
      
      // Update local job state
      if (result.data) {
        setJob(result.data);
      }
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Loading job details...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (loadError || !job) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">
                  {loadError || 'Job not found'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Job Application</h1>
          <p className="text-gray-600 mt-1">
            Update the details of your job application for{' '}
            <span className="font-medium">{job.jobTitle}</span> at{' '}
            <span className="font-medium">{job.companyName}</span>.
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success!</h3>
                <p className="mt-1 text-sm text-green-700">
                  Job application has been updated successfully. Redirecting to dashboard...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Job Form */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Job Application Details</h2>
              <JobForm
                initialData={{
                  id: job.id,
                  dateAdded: job.dateAdded,
                  jobTitle: job.jobTitle,
                  companyName: job.companyName,
                  applicationLink: job.applicationLink,
                  status: job.status,
                  jobDescription: job.jobDescription || '',
                }}
                onSubmit={handleSubmit}
                submitButtonText="Update Job Application"
              />
            </div>
          </div>

          {/* Job Analyzer & AI Analysis Display */}
          <div className="space-y-6">
            {/* Existing AI Analysis */}
            {job.aiAnalysis && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Previous AI Analysis</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Summary</h3>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                        {job.aiAnalysis.summary}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Suggested Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.aiAnalysis.suggestedSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Analyzed on {new Date(job.aiAnalysis.analyzedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* New Job Analyzer */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {job.aiAnalysis ? 'Re-analyze Job Description' : 'AI Job Analysis'}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {job.aiAnalysis 
                    ? 'Run a new analysis to get updated insights and skill recommendations.'
                    : 'Paste the job description below to get AI-powered insights and skill recommendations.'
                  }
                </p>
                <JobAnalyzer jobDescription={job.jobDescription || ''} />
              </div>
            </div>
          </div>
        </div>

        {/* Application Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">📋 Application Information:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Date Added:</span> {new Date(job.dateAdded).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Current Status:</span>{' '}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                job.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                job.status === 'Interviewing' ? 'bg-yellow-100 text-yellow-800' :
                job.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                'bg-green-100 text-green-800'
              }`}>
                {job.status}
              </span>
            </div>
            <div>
              <span className="font-medium">Application Link:</span>{' '}
              <a
                href={job.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View Original
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditJobPage;