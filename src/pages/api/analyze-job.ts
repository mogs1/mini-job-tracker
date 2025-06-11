// pages/api/analyze-job.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { APIResponse, JobAnalysisRequest, JobAnalysisResponse } from '@/types/job';
import { analyzeJobDescription, mockAnalyzeJobDescription } from '@/utils/openai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<JobAnalysisResponse>>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  }

  try {
    const { jobDescription }: JobAnalysisRequest = req.body;

    // Validation
    if (!jobDescription || typeof jobDescription !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Job description is required and must be a string',
      });
    }

    if (jobDescription.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Job description must be at least 50 characters long',
      });
    }

    // Check if OpenAI API key is available
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    
    let analysis: JobAnalysisResponse;
    
    if (hasOpenAIKey) {
      try {
        analysis = await analyzeJobDescription(jobDescription);
      } catch (error) {
        console.error('OpenAI analysis failed, using mock:', error);
        // Fallback to mock analysis if OpenAI fails
        analysis = mockAnalyzeJobDescription(jobDescription);
      }
    } else {
      // Use mock analysis if no API key is configured
      console.log('No OpenAI API key found, using mock analysis');
      analysis = mockAnalyzeJobDescription(jobDescription);
    }

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Error analyzing job description:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to analyze job description. Please try again.',
    });
  }
}