// src/app/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast'

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard page when the root page loads
    router.push('/dashboard');
  }, [router]);

  // Return a loading state while the redirect happens
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster 
          position="top-right" 
          reverseOrder={false} 
          />
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );    
}