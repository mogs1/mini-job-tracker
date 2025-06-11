// pages/add-job.tsx
'use client';

import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import JobForm from '@/components/JobForm';
import JobAnalyzer from '@/components/JobAnalyzer';
import { JobFormData, APIResponse, Job } from '@/types/job';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const AddJobPage: NextPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = async (formData: JobFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: APIResponse<Job> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create job application');
      }

      toast.success('Job application added successfully!');
      setSubmitSuccess(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Add New Job Application</h1>
          <p className="text-gray-600 mt-1">
            Fill in the details of your job application and optionally analyze the job description with AI.
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
                  Job application has been added successfully. Redirecting to dashboard...
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
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
                submitButtonText="Add Job Application"
              />
            </div>
          </div>

          {/* Job Analyzer */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">AI Job Analysis</h2>
              <p className="text-sm text-gray-600 mb-4">
                Paste the job description below to get AI-powered insights and skill recommendations.
              </p>
          <textarea
          className="w-full text-black border rounded-md p-2 mb-4" 
          rows={6}
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          />
              <JobAnalyzer 
              jobDescription={jobDescription}
              // onAnalysisComplete={}
              />
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for better tracking:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Include the direct application link for easy reference</li>
            <li>• Use the AI analyzer to identify key skills to highlight in your resume</li>
            <li>• Update the status as your application progresses</li>
            <li>• Keep job descriptions for future reference and interview preparation</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default AddJobPage;