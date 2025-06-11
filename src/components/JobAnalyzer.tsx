// components/JobAnalyzer.tsx
'use client'

import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, AlertCircle, Brain, Target } from 'lucide-react';
import { JobAnalysisResponse, APIResponse } from '@/types/job';

interface JobAnalyzerProps {
  jobDescription: string;
  onAnalysisComplete?: (summary: string, skills: string[]) => void;
}

const JobAnalyzer: React.FC<JobAnalyzerProps> = ({ jobDescription, onAnalysisComplete }) => {
  const [analysis, setAnalysis] = useState<JobAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeJob = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description first');
      return;
    }

    if (jobDescription.trim().length < 50) {
      setError('Job description must be at least 50 characters long');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: jobDescription.trim(),
        }),
      });

      const result: APIResponse<JobAnalysisResponse> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to analyze job description');
      }

      if (result.data) {
        setAnalysis(result.data);
        onAnalysisComplete?.(result.data.summary, result.data.suggestedSkills);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">AI Job Analysis</h3>
        </div>
        <button
          onClick={analyzeJob}
          disabled={isLoading || !jobDescription.trim()}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          <span>{isLoading ? 'Analyzing...' : 'Analyze Job'}</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Error</span>
          </div>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-green-800 mb-4">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Analysis Complete</span>
          </div>

          {/* Job Summary */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-gray-600" />
              <h4 className="text-sm font-medium text-gray-900">Job Summary</h4>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-sm text-gray-700 leading-relaxed">{analysis.summary}</p>
            </div>
          </div>

          {/* Suggested Skills */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-4 w-4 text-gray-600" />
              <h4 className="text-sm font-medium text-gray-900">Recommended Skills for Your Resume</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.suggestedSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Highlight these skills in your resume and cover letter to increase your chances of getting noticed.
            </p>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Pro Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use these skills as keywords in your application</li>
              <li>• Prepare specific examples demonstrating these skills</li>
              <li>• Research the company culture and values</li>
              <li>• Tailor your resume to match the job requirements</li>
            </ul>
          </div>
        </div>
      )}

      {!analysis && !error && !isLoading && (
        <div className="text-center py-8">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-500 mb-4">
            Get AI-powered insights about this job opportunity
          </p>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Job description summary</li>
            <li>• Key skills to highlight</li>
            <li>• Application tips</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default JobAnalyzer;