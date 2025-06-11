// pages/404.tsx
'use client'
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Layout from '@/components/Layout';

export default function Custom404() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. The job application you're 
            trying to access might have been removed or the URL might be incorrect.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors w-full justify-center"
            >
              <Home className="w-5 h-5" />
              Back to Dashboard
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors w-full justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Check out our{' '}
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                dashboard
              </Link>
              {' '}or{' '}
              <Link href="/add-job" className="text-blue-600 hover:text-blue-700 font-medium">
                add a new job
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}