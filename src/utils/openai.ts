// utils/openai.ts
import { JobAnalysisResponse } from '@/types/job';

export async function analyzeJobDescription(jobDescription: string): Promise<JobAnalysisResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `
Analyze the following job description and provide:
1. A brief 2-3 sentence summary of the job
2. The top 3 most important skills a candidate should highlight in their resume for this position

Job Description:
${jobDescription}

Please respond in the following JSON format:
{
  "summary": "Brief job summary here",
  "suggestedSkills": ["skill1", "skill2", "skill3"]
}
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that analyzes job descriptions. Always respond with valid JSON in the exact format requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const analysis = JSON.parse(content);
    
    return {
      summary: analysis.summary,
      suggestedSkills: analysis.suggestedSkills,
    };
  } catch (error) {
    console.error('Error analyzing job description:', error);
    
    // Fallback response if OpenAI fails
    return {
      summary: 'Unable to analyze job description at this time. Please try again later.',
      suggestedSkills: ['Communication', 'Problem Solving', 'Teamwork'],
    };
  }
}

// Alternative mock function for testing without API key
export function mockAnalyzeJobDescription(jobDescription: string): JobAnalysisResponse {
  const keywords = jobDescription.toLowerCase();
  
  let suggestedSkills = ['Communication', 'Problem Solving', 'Teamwork'];
  
  if (keywords.includes('react') || keywords.includes('javascript')) {
    suggestedSkills = ['React', 'JavaScript', 'Frontend Development'];
  } else if (keywords.includes('python') || keywords.includes('django')) {
    suggestedSkills = ['Python', 'Django', 'Backend Development'];
  } else if (keywords.includes('data') || keywords.includes('analytics')) {
    suggestedSkills = ['Data Analysis', 'SQL', 'Python'];
  } else if (keywords.includes('marketing') || keywords.includes('social media')) {
    suggestedSkills = ['Digital Marketing', 'Social Media', 'Content Creation'];
  }

  return {
    summary: `This position requires a skilled professional with experience in the specified domain. The role involves collaborative work and requires strong technical and interpersonal skills.`,
    suggestedSkills,
  };
}