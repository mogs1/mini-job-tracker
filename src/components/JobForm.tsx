// components/JobForm.tsx
'use client'

import React, { useState } from 'react';
import { Job, JobFormData, JobStatus, JOB_STATUSES } from '@/types/job';
import { Save, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import JobAnalyzer from './JobAnalyzer';

interface JobFormProps {
  onSubmit: (data: JobFormData) => Promise<void>;
  initialData?: Job;
  isLoading?: boolean;
  submitButtonText?: React.ReactNode;
}

const JobForm: React.FC<JobFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  submitButtonText = 'Save Job Application'
}) => {
  const [formData, setFormData] = useState<JobFormData>({
    jobTitle: initialData?.jobTitle || '',
    companyName: initialData?.companyName || '',
    applicationLink: initialData?.applicationLink || '',
    status: initialData?.status || 'Applied',
    jobDescription: initialData?.jobDescription || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAnalyzer, setShowAnalyzer] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.applicationLink.trim()) {
      newErrors.applicationLink = 'Application link is required';
    } else if (!/^https?:\/\/.+/.test(formData.applicationLink)) {
      newErrors.applicationLink = 'Please enter a valid URL starting with http:// or https://';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleAnalysisComplete = (summary: string, skills: string[]) => {
    // You could store this analysis in the form data if needed
    console.log('Analysis complete:', { summary, skills });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 shadow-sm rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Job Title */}
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                Job Title *
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className={`mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.jobTitle ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="e.g., Senior Frontend Developer"
              />
              {errors.jobTitle && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.jobTitle}
                </div>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className={`mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.companyName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="e.g., Google, Microsoft, Startup Inc."
              />
              {errors.companyName && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.companyName}
                </div>
              )}
            </div>

            {/* Application Link */}
            <div>
              <label htmlFor="applicationLink" className="block text-sm font-medium text-gray-700">
                Application Link *
              </label>
              <input
                type="url"
                id="applicationLink"
                name="applicationLink"
                value={formData.applicationLink}
                onChange={handleInputChange}
                className={`mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.applicationLink ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="https://company.com/careers/job-posting"
              />
              {errors.applicationLink && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.applicationLink}
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Application Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.status ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              >
                {JOB_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.status}
                </div>
              )}
            </div>

            {/* Job Description */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
                  Job Description (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowAnalyzer(!showAnalyzer)}
                  className="flex items-center cursor-pointer space-x-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>AI Analysis</span>
                </button>
              </div>
              <textarea
                id="jobDescription"
                name="jobDescription"
                rows={6}
                value={formData.jobDescription}
                onChange={handleInputChange}
                className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Paste the job description here for AI analysis..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Add the job description to get AI-powered insights and skill recommendations
              </p>
            </div>
          </div>
        </div>

        {/* AI Analyzer */}
        {showAnalyzer && formData.jobDescription && (
          <JobAnalyzer
            jobDescription={formData.jobDescription}
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isLoading ? 'Saving...' : submitButtonText}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;