// app/page.tsx (for App Router) or pages/index.tsx (for Pages Router)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import JobTable from '@/components/JobTable';
import { Job, APIResponse } from '@/types/job';
import { 
  Plus, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Award,
  Briefcase,
  RefreshCw
} from 'lucide-react';

// Remove NextPage type for App Router, or keep it for Pages Router
export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/jobs');
      const result: APIResponse<Job[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch jobs');
      }
      
      setJobs(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
      });
      
      const result: APIResponse<null> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete job');
      }
      
      // Remove the job from the local state
      setJobs(prev => prev.filter(job => job.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete job';
      setError(errorMessage);
    }
  };

  const handleRefresh = () => {
    fetchJobs();
  };

  // Calculate statistics
  const stats = {
    total: jobs.length,
    applied: jobs.filter(job => job.status === 'Applied').length,
    interviewing: jobs.filter(job => job.status === 'Interviewing').length,
    rejected: jobs.filter(job => job.status === 'Rejected').length,
    offers: jobs.filter(job => job.status === 'Offer').length,
  };

  const StatCard = ({ icon: Icon, title, value, color }: {
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    title: string;
    value: number;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className="h-8 w-8" style={{ color }} />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Loading jobs...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Application Dashboard</h1>
            <p className="text-gray-600 mt-1">Track and manage your job applications</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <Link
              href="/add-job"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Job
            </Link>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <StatCard
            icon={Briefcase}
            title="Total Applications"
            value={stats.total}
            color="#3B82F6"
          />
          <StatCard
            icon={Clock}
            title="Applied"
            value={stats.applied}
            color="#6B7280"
          />
          <StatCard
            icon={TrendingUp}
            title="Interviewing"
            value={stats.interviewing}
            color="#F59E0B"
          />
          <StatCard
            icon={XCircle}
            title="Rejected"
            value={stats.rejected}
            color="#EF4444"
          />
          <StatCard
            icon={Award}
            title="Offers"
            value={stats.offers}
            color="#10B981"
          />
        </div>

        {/* Jobs Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Applications</h2>
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No job applications yet</h3>
                <p className="text-gray-600 mb-6">Get started by adding your first job application.</p>
                <Link
                  href="/add-job"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Job
                </Link>
              </div>
            ) : (
              <JobTable jobs={jobs} onDelete={handleDeleteJob} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}